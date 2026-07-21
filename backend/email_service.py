import os
import logging
from email.message import EmailMessage

import aiosmtplib

logger = logging.getLogger(__name__)

# -------- SMTP configuration (standard, provider-agnostic) --------
# Works with any SMTP provider: Gmail, Brevo, Mailgun, SendGrid, Amazon SES, Postmark, etc.
# If SMTP_HOST is not set, email sending is a safe no-op (the app keeps working normally).
#
#   SMTP_HOST      e.g. smtp-relay.brevo.com / smtp.gmail.com / smtp.sendgrid.net
#   SMTP_PORT      587 (STARTTLS, default) or 465 (implicit SSL)
#   SMTP_USER      SMTP username / login
#   SMTP_PASSWORD  SMTP password / API key
#   SMTP_FROM      envelope + header From address (e.g. no-reply@votre-domaine.fr)
#   SMTP_STARTTLS  "true" (default) for port 587 STARTTLS
#   SMTP_SSL       "true" for port 465 implicit TLS (overrides STARTTLS)
#   EMAIL_FROM_NAME  display name (default "EuroKredit")
SMTP_HOST = os.environ.get("SMTP_HOST", "")
SMTP_PORT = int(os.environ.get("SMTP_PORT", "587"))
SMTP_USER = os.environ.get("SMTP_USER", "")
SMTP_PASSWORD = os.environ.get("SMTP_PASSWORD", "")
SMTP_FROM = os.environ.get("SMTP_FROM", "no-reply@eurokredit.fr")
SMTP_STARTTLS = os.environ.get("SMTP_STARTTLS", "true").lower() == "true"
SMTP_SSL = os.environ.get("SMTP_SSL", "false").lower() == "true"
EMAIL_FROM_NAME = os.environ.get("EMAIL_FROM_NAME", "EuroKredit")

# 5-step process
STEPS = ["submitted", "review", "preapproved", "contract_sent", "disbursed"]

STEP_META = {
    "submitted": {
        "subject": "Votre demande EuroKredit a bien été reçue",
        "title": "Demande enregistrée",
        "eyebrow": "01 — Demande soumise",
        "body": (
            "Nous avons bien reçu votre demande de financement. Notre équipe la prend en charge "
            "et vous recontactera sous 48 heures ouvrées."
        ),
    },
    "review": {
        "subject": "Votre dossier EuroKredit est à l'étude",
        "title": "Votre dossier est à l'étude",
        "eyebrow": "02 — En examen",
        "body": (
            "Nos conseillers étudient votre dossier avec la précision d'un cabinet privé. "
            "Nous revenons vers vous très prochainement avec un premier retour."
        ),
    },
    "preapproved": {
        "subject": "EuroKredit — Vous avez obtenu un pré-accord",
        "title": "Pré-accord obtenu",
        "eyebrow": "03 — Pré-accord",
        "body": (
            "Excellente nouvelle : votre demande a reçu un pré-accord. Votre conseiller "
            "prendra contact avec vous pour affiner les modalités et préparer le contrat."
        ),
    },
    "contract_sent": {
        "subject": "EuroKredit — Votre contrat est prêt à la signature",
        "title": "Contrat envoyé",
        "eyebrow": "04 — Contrat",
        "body": (
            "Votre contrat vient d'être envoyé. Consultez votre boîte de réception dédiée "
            "pour finaliser la signature électronique. Les fonds seront décaissés dans les jours suivants."
        ),
    },
    "disbursed": {
        "subject": "EuroKredit — Vos fonds ont été décaissés",
        "title": "Fonds décaissés",
        "eyebrow": "05 — Décaissement",
        "body": (
            "Félicitations. Vos fonds ont été virés sur votre compte bancaire. "
            "Merci de la confiance que vous accordez à EuroKredit — nous restons à vos côtés."
        ),
    },
}


def _base_html(title: str, eyebrow: str, greeting: str, body: str, cta_label: str, cta_url: str, footer_note: str = "") -> str:
    return f"""<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{title}</title>
</head>
<body style="margin:0;padding:0;background-color:#0A0A0A;font-family:Helvetica,Arial,sans-serif;color:#FAFAFA;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#0A0A0A;">
    <tr>
      <td align="center" style="padding:48px 16px;">
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;width:100%;background-color:#0A0A0A;border:1px solid #1B1B1F;">
          <tr>
            <td style="padding:32px 40px 24px 40px;border-bottom:1px solid rgba(255,255,255,0.08);">
              <div style="font-family:Georgia,serif;font-size:26px;letter-spacing:-0.02em;color:#FAFAFA;">
                Euro<span style="color:#D4AF37;font-style:italic;">Kredit</span>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding:40px 40px 8px 40px;">
              <p style="margin:0 0 24px 0;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#D4AF37;">
                {eyebrow}
              </p>
              <h1 style="margin:0 0 20px 0;font-family:Georgia,serif;font-size:36px;line-height:1.1;color:#FAFAFA;letter-spacing:-0.02em;">
                {title}
              </h1>
              <p style="margin:0 0 16px 0;font-size:15px;line-height:1.6;color:rgba(250,250,250,0.75);">
                {greeting}
              </p>
              <p style="margin:0 0 32px 0;font-size:15px;line-height:1.7;color:rgba(250,250,250,0.65);">
                {body}
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:0 40px 40px 40px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td>
                    <a href="{cta_url}" style="display:inline-block;padding:14px 28px;border:1px solid #D4AF37;color:#D4AF37;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;text-decoration:none;">
                      {cta_label} →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 40px;border-top:1px solid rgba(255,255,255,0.08);">
              <p style="margin:0 0 6px 0;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:rgba(250,250,250,0.4);">
                EuroKredit
              </p>
              <p style="margin:0;font-size:12px;line-height:1.6;color:rgba(250,250,250,0.4);">
                28, rue de la Banque — 75002 Paris, France<br />
                Un crédit vous engage et doit être remboursé.
              </p>
              {f'<p style="margin:12px 0 0 0;font-size:11px;color:rgba(250,250,250,0.35);">{footer_note}</p>' if footer_note else ''}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>"""


async def _send(recipient: str, subject: str, html: str) -> None:
    """Fire-and-log: never let email failures break the main flow."""
    if not SMTP_HOST:
        logger.info("SMTP not configured (SMTP_HOST unset), skipping email '%s' to %s", subject, recipient)
        return

    message = EmailMessage()
    message["From"] = f"{EMAIL_FROM_NAME} <{SMTP_FROM}>"
    message["To"] = recipient
    message["Subject"] = subject
    message.set_content(
        "Cet email nécessite un client compatible HTML pour un affichage optimal."
    )
    message.add_alternative(html, subtype="html")

    try:
        await aiosmtplib.send(
            message,
            hostname=SMTP_HOST,
            port=SMTP_PORT,
            username=SMTP_USER or None,
            password=SMTP_PASSWORD or None,
            start_tls=SMTP_STARTTLS and not SMTP_SSL,
            use_tls=SMTP_SSL,
            timeout=15,
        )
        logger.info("Email sent '%s' -> %s", subject, recipient)
    except Exception as e:
        logger.exception("Email failed '%s' -> %s : %s", subject, recipient, e)


def _dashboard_url(frontend_url: str, app_id: str | None = None) -> str:
    base = (frontend_url or "").rstrip("/")
    if app_id:
        return f"{base}/client/applications/{app_id}"
    return f"{base}/client"


async def send_welcome_email(recipient: str, name: str, frontend_url: str) -> None:
    subject = "Bienvenue chez EuroKredit"
    html = _base_html(
        title="Bienvenue,",
        eyebrow="Espace client · Ouverture",
        greeting=f"Bonjour {name},",
        body=(
            "Votre espace client EuroKredit est ouvert. Vous pouvez désormais suivre chacune "
            "de vos demandes de financement, étape par étape, en toute confidentialité."
        ),
        cta_label="Accéder à mon espace",
        cta_url=_dashboard_url(frontend_url),
    )
    await _send(recipient, subject, html)


async def send_application_created_email(recipient: str, name: str, app_id: str, loan_type: str, amount: float, months: int, frontend_url: str) -> None:
    meta = STEP_META["submitted"]
    label_map = {
        "personnel": "Prêt personnel", "immobilier": "Prêt immobilier",
        "auto": "Crédit auto", "professionnel": "Prêt professionnel",
        "rachat": "Rachat de crédit",
    }
    body = (
        f"{meta['body']}<br /><br />"
        f"<strong style='color:#FAFAFA;'>Récapitulatif</strong><br />"
        f"Type : {label_map.get(loan_type, loan_type)}<br />"
        f"Montant : {amount:,.0f} €<br />"
        f"Durée : {months} mois<br />"
        f"Référence : {app_id[:8].upper()}"
    ).replace(",", " ")
    html = _base_html(
        title=meta["title"],
        eyebrow=meta["eyebrow"],
        greeting=f"Bonjour {name},",
        body=body,
        cta_label="Suivre ma demande",
        cta_url=_dashboard_url(frontend_url, app_id),
        footer_note=f"Référence dossier : {app_id[:8].upper()}",
    )
    await _send(recipient, meta["subject"], html)


async def send_step_email(recipient: str, name: str, app_id: str, step: str, frontend_url: str) -> None:
    meta = STEP_META.get(step)
    if not meta:
        return
    html = _base_html(
        title=meta["title"],
        eyebrow=meta["eyebrow"],
        greeting=f"Bonjour {name},",
        body=meta["body"],
        cta_label="Consulter mon dossier",
        cta_url=_dashboard_url(frontend_url, app_id),
        footer_note=f"Référence dossier : {app_id[:8].upper()}",
    )
    await _send(recipient, meta["subject"], html)

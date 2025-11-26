import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from datetime import datetime

def send_login_notification(email: str):
    """
    Sends an email notification to the admin when a login occurs.
    """
    sender_email = os.getenv("SMTP_USER")
    sender_password = os.getenv("SMTP_PASSWORD")
    smtp_server = os.getenv("SMTP_HOST", "smtp.gmail.com")
    smtp_port = int(os.getenv("SMTP_PORT", "587"))

    if not sender_email or not sender_password:
        print("Warning: SMTP credentials not found. Email notification skipped.")
        return

    subject = "New Login Alert - Pro Garden CRM"
    body = f"""
    <html>
      <body>
        <h2>New Login Detected</h2>
        <p>Hello Admin,</p>
        <p>A new login was detected for your account <strong>{email}</strong> on <strong>{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}</strong>.</p>
        <p>If this was you, you can ignore this message.</p>
        <p>Best regards,<br>Pro Garden CRM Team</p>
      </body>
    </html>
    """

    message = MIMEMultipart()
    message["From"] = sender_email
    message["To"] = email
    message["Subject"] = subject
    message.attach(MIMEText(body, "html"))

    try:
        with smtplib.SMTP(smtp_server, smtp_port) as server:
            server.starttls()
            server.login(sender_email, sender_password)
            server.send_message(message)
        print(f"Login notification sent to {email}")
    except Exception as e:
        print(f"Failed to send email: {e}")

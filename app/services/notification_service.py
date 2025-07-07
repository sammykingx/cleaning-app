# sends notifications to the user and admin
from flask import current_app
from flask_mail import Message
from app.extensions import mail
from app.constants import ADMINS as admins_list


class NotificationService:
    
    def __init__(self, user_email: str, subject:str, message:str):
        """Initialize the NotificationService with user and event."""
        
        self.user_email = user_email
        self.subject = subject
        self.message = message

    def send_to_client(self):
        """Send booking confirmation to the client."""
        
        user_msg = Message(self.subject, recipients=[self.user_email], html=self.message, cc=[*admins_list], reply_to="seromosele@divgm.com")
        
        try:
            mail.send(user_msg)

        except Exception as err:
            current_app.logger.error(err, exc_info=True)
            return False

        return True
    
    def send_to_admin(self):
        """Send booking details to the admin."""
        
        admin_messages = [
            Message(subject=self.subject, recipients=[recipient], html=self.message)
            for recipient in admins_list
        ]
        
        try:
            with mail.connect() as conn:
                conn.send(admin_messages)
                
        except Exception as err:
            current_app.logger.error(err, exc_info=True)
            return False

        return True
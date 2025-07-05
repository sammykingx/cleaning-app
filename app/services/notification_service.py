# sends notifications to the user and admin
from flask import current_app
from flask_mail import Message
from app.extensions import mail
from app.models.clients import Clients
from app.constants import ADMINS as admins_list


class NotificationService:
    
    def __init__(self, user: Clients, subject:str, message:str):
        """Initialize the NotificationService with user and event."""
        
        self.user = user
        self.subject = subject
        self.message = message
        print(f"NotificationService initialized for user: {self.user.email} with subject: {self.subject}")
    
    def send_mail(self, notify_admin=True) -> None:
        """Send an email notification to both client's and admin mailbox"""
        
        user_msg = Message(self.subject, recipients=[self.user.email], html=self.message)
        if notify_admin:
            email_messages = [
                Message(subject=self.subject, recipients=[recipient], html=self.message)
                for recipient in admins_list
            ]
            email_messages.append(user_msg)
            
        else:
            email_messages = [user_msg]
            
        try:
            # Send all at once
            with mail.connect() as conn:
                conn.send(email_messages)
            
            # mail.send(user_msg)

        except Exception as err:
            # current_app.logger.error(err, exc_info=True)
            return False
        
        # If the email is sent successfully, return True
        return True

    def send_to_customer(self):
        """Send booking confirmation to the customer."""
        
        user_msg = Message(self.subject, recipients=[self.user.email], html=self.message)
        print("message object ready for mail transport")
        
        try:
            print("inside try block to send message to customer")
            mail.send(user_msg)

        except Exception as err:
            print("In exception block")
            current_app.logger.error(err, exc_info=True)
            return False
        
        print("message sent to customer")
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
            # current_app.logger.error(err, exc_info=True)
            return False

        return True
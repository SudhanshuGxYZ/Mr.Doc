from django.db import models
from accounts.models import CustomUser

class Prompt(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    input_text = models.TextField()
    response_text = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.user_message[:50]

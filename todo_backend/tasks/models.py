from django.db import models
from django.contrib.auth.models import User

# Create your models here.
# This is a Django model for a Task in a to-do application.
class Task(models.Model):
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
    ]

    TAG_CHOICES = [
        ('work', 'Work'),
        ('study', 'Study'),
        ('personal', 'Personal'),
        ('urgent', 'Urgent'),
    ]

    title = models.CharField(max_length=255)
    completed = models.BooleanField(default=False)
    deadline = models.DateField(null=True, blank=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='medium')
    tag = models.CharField(max_length=10, choices=TAG_CHOICES, default='personal')

    def __str__(self):
        return self.title
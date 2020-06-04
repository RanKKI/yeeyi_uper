from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, IntegerField, SubmitField, BooleanField, TextAreaField
from wtforms.validators import DataRequired


class NewForm(FlaskForm):
    tid = StringField("tid", validators=[DataRequired()])
    username = StringField("username", validators=[DataRequired()])
    password = PasswordField("password", validators=[DataRequired()])
    start = IntegerField("start", validators=[DataRequired()])
    end = IntegerField("end", validators=[DataRequired()])
    repost = BooleanField("repost")
    content = TextAreaField("content")
    sub = SubmitField("submit")


class LoginForm(FlaskForm):
    password = PasswordField("password", validators=[DataRequired()])

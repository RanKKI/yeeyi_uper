from flask import Blueprint, request, render_template, redirect, url_for
from web_app.database import Record, Log, u
from web_app.forms import NewForm, LoginForm
from web_app import lm
from flask_login import login_required, login_user

views = Blueprint("views", __name__)


@lm.user_loader
def loader(uid):
    return u


@views.route("/", methods=["GET", "POST"])
@views.route("/view/<string:tid>")
@login_required
def index(tid=None):
    form = NewForm(request.form)
    current = None
    if not tid and request.method == "POST" and form.validate():
        current = Record.new(form)
        current.save()
        tid = current.tid
    elif tid:
        current = Record.get(tid)

    return render_template(
        'index.html',
        data=Record.get_all(),
        form=form,
        current=current,
        log=Log.get(tid)
    )


@views.route("/view/<string:tid>/delete")
@login_required
def delete(tid=None):
    current = Record.get(tid)
    if current:
        current.delete()
    return redirect(url_for('views.index'))


@views.route("/login", methods=["GET", "POST"])
def login():
    form = LoginForm(request.form)
    if request.method == "POST" and form.validate() and form.password.data == "rankki":
        login_user(u)
        return redirect(url_for('views.index'))
    return render_template("login.html", form=form)


from datetime import datetime, timedelta

from web_app import db
from web_app.forms import NewForm

from flask_login import UserMixin


class Record(db.Model):
    __tablename__ = 'record'  # 表名

    tid = db.Column(db.String(20), primary_key=True)
    username = db.Column(db.String(20), nullable=False)
    password = db.Column(db.String(20), nullable=False)
    start = db.Column(db.Integer, nullable=False)
    end = db.Column(db.Integer, nullable=False)

    cookies = db.Column(db.String(200))
    count = db.Column(db.Integer, default=0)
    left = db.Column(db.Integer, default=15)

    time = db.Column(db.String(10))
    interval = db.Column(db.Integer)

    content = db.Column(db.Text)
    is_repost = db.Column(db.Boolean, default=False)

    @classmethod
    def new(cls, form: NewForm):
        data = {
            "username": form.username.data,
            "password": form.password.data,
            "tid": form.tid.data,
            "start": max(form.start.data, 0),
            "end": min(form.end.data, 24),
            "content": form.content.data,
            "is_repost": form.repost.data,
        }
        if data["end"] < data["start"]:
            data["start"], data["end"] = 9, 21
        data.update({
            "time": f"{data['start']}:00".zfill(5),
            "interval": abs((data['end'] - data['start']) / 15 * 60)
        })
        now = datetime.now()
        if data["start"] <= now.hour <= data["end"]:
            data["time"] = (now + timedelta(minutes=2)).strftime("%H:%M")
        Log.new(data["tid"], f"Created, start time {data['time']}")
        return cls(**data)

    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    @staticmethod
    def get(tid):
        return Record.query.filter_by(tid=tid).first()

    @staticmethod
    def get_all():
        return Record.query.all()


class Log(db.Model):
    __tablename__ = 'log'  # 表名

    id = db.Column(db.Integer, primary_key=True)
    tid = db.Column(db.String(20))
    time = db.Column(db.DateTime)
    msg = db.Column(db.String(100))

    @staticmethod
    def new(tid, msg):
        log = Log(
            tid=tid,
            time=datetime.now(),
            msg=msg
        )
        db.session.add(log)
        db.session.commit()

    @staticmethod
    def get(tid: int):
        return Log.query.filter_by(tid=tid).order_by(Log.id.desc()).limit(20).all()


class U(UserMixin):
    def get_id(self):
        return 1


u = U()

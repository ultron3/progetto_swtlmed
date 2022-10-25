import mysql.connector
from flask import Flask, render_template, request, url_for, flash, redirect,jsonify
from werkzeug.exceptions import abort

app = Flask(__name__)
app.config['SECRET_KEY'] = 'QWERTYUIOP1234567890'

def get_db_connection():
    conn = mysql.connector.connect(host="localhost",user="root",password="telemedicina2123")
    return conn

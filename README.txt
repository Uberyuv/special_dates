sDates: Never Forget the special moments of your life.

Actors: User, Admin;

db: User, Dates;

this app will give notifications according to date, and remind the user of the upcoming occasions like anniversary, bddays, a date, or a meeting with someone, and other Special dates.

the database will store the data and tables(documents). the model will be created to represent the schema of the database. and used for storage.

Db:

User:{
    name, Dob, email, phone, password, usertype,  
}


APIs:

/  signIn

For User:
/adduser
/removeuser
/getuser
/getalluser : only admin can use this
/updateuser

For dates:
/adddate
/removedate

/getdateforoccasion

/getoccasions

/getalloccasions : only admin can use this

/updateoccasion

Method:
A cron operation will run and will keep on checking for all upcoming occasions with pending time less than 7 days.

for 7-4 days: Give notifications
for 3 days: contant reminder
less than a day: counting and reminder

the day: notification to person whose info has been entered.

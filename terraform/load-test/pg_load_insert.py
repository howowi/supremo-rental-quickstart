#!/usr/bin/python3
import psycopg2
import sys
import os
import getopt
from datetime import datetime
#import subprocess
import threading
import random
import string
from datetime import datetime, timedelta
import time
import logging

class insertSyncTableThread (threading.Thread):
    def __init__(self, threadID, rand_string):
        threading.Thread.__init__(self)
        self._threadID = threadID + 1
        self._order_prefix=f"Load_{rand_string}_{self._threadID}-"
        self._order_id=1
        #self._pre_order_id=1
        self._save_item={}

        #PGPASSWORD='BotWelcome123##' psql -h 10.0.1.71 -U ouser -d poc_car

        self._conn = self.connect_to_database()
    def connect_to_database(self):
        try:
            print ('Connecting to: %s' % _HOSTNAME)
            conn = psycopg2.connect(
                    user="ouser",
                    password="BotWelcome123##",
                    host=_HOSTNAME,
                    port="5432",
                    database="poc_car"
            )
            print ('Connected: %s' % _HOSTNAME)
            return conn
        except Exception as e:
        #except psycopg2.OperationalError:
            logging.error(f"Failed to connect to the database ({e}). Retrying in 5 seconds... ")
            time.sleep(5)
            return None
            
        return conn
        
    def get_random_string(self,length):
        characters = string.ascii_letters + string.digits
        return ''.join(random.choice(characters) for _ in range(length))

    def generate_random_datetime(self, start_datetime, end_datetime):
        # Convert start and end datetimes to timestamps
        start_timestamp = start_datetime.timestamp()
        end_timestamp = end_datetime.timestamp()

        # Generate a random timestamp within the specified range
        random_timestamp = random.uniform(start_timestamp, end_timestamp)

        # Convert the random timestamp back to a datetime object
        random_datetime = datetime.fromtimestamp(random_timestamp)

        return random_datetime

    def get_random_userid(self):
        lst_userid=['JohnC','markg','samy','davidp','thussian','sarag','hysun']
        random_userid = random.choice(lst_userid)
        return random_userid

    def run(self):
        begin_time = datetime.now()
        logging.info(f"Thread {self._threadID} start : {begin_time}")

        random_number = random.randint(1, 27)
        formatted_number = '{:03d}'.format(random_number)

        #car_id = f"t{formatted_number}"
        car_id = f"t027"
        while (True):
            try:
                # Create a cursor object
                order_id=f"{self._order_prefix}{self._order_id}"
                #self._pre_order_id=order_id

                random_number = random.randint(1, 27)
                formatted_number = '{:03d}'.format(random_number)

                #car_id = f"t{formatted_number}"
                #car_id = f"t017"
                start_datetime = datetime(2020, 1, 1)
                end_datetime = datetime(2024, 12, 31)

                #start_datetime = datetime(2021, 1, 3, 14, 50, 55)
                #end_datetime = datetime(2024, 4, 3, 14, 50, 55)

                # Generate a random datetime within the specified range
                #random_datetime = self.generate_random_datetime(start_datetime, end_datetime)
                #userid= self.get_random_userid()

                insert_query = f'''
                insert into public.orders (orderid, carid, userid, duration, ordered, name, brand, from_date, end_date)
                values (
                '{order_id}',
                '{car_id}',
                'JohnC',
                1,
                'true',
                'Cerato',
                'Kia',
                '{start_datetime}',
                '{end_datetime}'
                )
                '''


                logging.info(insert_query)
                cursor = self._conn.cursor()
                cursor.execute(insert_query)
                self._conn.commit()
                cursor.close()
                logging.info("order_id %d", self._order_id)
                self._order_id=self._order_id+1
                time.sleep(0.01)

            except Exception as e:
                logging.error(f"Error executing query: {e}")
                while True:
                    self._conn = self.connect_to_database()
                    if self._conn is not None:
                        logging.warning("Reconnect successfully:")
                        break
                    else:
                        logging.error("Failed to establish a connection to the database. Retrying...") 
                        #time.sleep(10)
                #return None
        
        logging.info(f"Thread {self._threadID} take milliseconds :{milliseconds_timestamp}")


    def __del__(self):
        # Close the cursor and connection
        self._conn.close()

def get_random_string(length):
    characters = string.ascii_letters + string.digits
    return ''.join(random.choice(characters) for _ in range(length))

_FILENAME=__file__
_THREADS_NUM=1
_HOSTNAME="10.0.30.111"

def getSysOpts():
    global _THREADS_NUM
    global _HOSTNAME
    usages = '''
    Usage: %s [OPTION]
    Start up pg load test
      -H help       show usage of the command
      -t threadnum  specifiy to start up how many threads
      -h hostname   hostname of the PostgreSQL 
    Example for none HA manual failover:nohup %s -t 10
    ''' %(_FILENAME,_FILENAME)

    try:
        opts, args = getopt.getopt(sys.argv[1:], 'Ht:h:')
        print(opts)
        for opt_name, opt_value in opts:
            if opt_name in ('-H'):
                print(usages)
                sys.exit()
            if opt_name in ('-t'):
                print('THREAD_NUM=', opt_value)
                _THREADS_NUM=int(opt_value)
            if opt_name in ('-h'):
                print('HOSTNAME=', opt_value)
                _HOSTNAME=opt_value.strip()
    except getopt.GetoptError as e:
        print ('ERROR: %s' % str(e))
        print(usages)
        sys.exit(2)

_DIRNAME=os.path.dirname(os.path.realpath(__file__))
logfile_import="%s/%s" %(_DIRNAME,"insert.log")

logging.basicConfig(level=logging.INFO,
                    format='%(asctime)s %(filename)s[line:%(lineno)d] %(levelname)s %(message)s',
                    #datefmt='%a, %d %b %Y %H:%M:%S',
                    datefmt='%a, %Y-%m-%d %H:%M:%S',
                    filename=logfile_import,
                    filemode='a')

if __name__ == '__main__':
    #global _THREADS_NUM
    #global _HOSTNAME
    getSysOpts()
    print ('UPDATED HOST= ',  _HOSTNAME)
    print ('UPDATEDH THREADS_NUM= ',  _THREADS_NUM)

    logging.info(f"_THREADS_NUM:{_THREADS_NUM}")
    #_THREADS_NUM = 1

    threads=[]
    for i in range(0,_THREADS_NUM):
        #dest schema is none for normal table import
        thread = insertSyncTableThread(i,get_random_string(5))
        thread.start()
        threads.append(thread)

    #需要处理的剩余文件，没有达到threads的个数，会走到这里
    if(len(threads) > 0):
        for t in threads:
            t.join()
        threads.clear


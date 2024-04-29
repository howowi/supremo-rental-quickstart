#!/usr/bin/python3
import psycopg2
import sys
import os
import getopt
#from datetime import datetime
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
        
        self._begin_time=datetime.now()
        #PGPASSWORD='BotWelcome123##' psql -h 10.0.1.71 -U ouser -d poc_car

        self._conn = self.connect_to_database()
    def connect_to_database(self):
        try:
            conn = psycopg2.connect(
                    user="ouser",
                    password="BotWelcome123##",
                    host=_HOST,
                    port="5432",
                    database="poc_car"
            )
            print ('Connected to %s' % _HOST)
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
        
    def get_random_userid(self):
        #lst_userid=['JohnC','markg','samy','davidp','thussian','sarag','hysun'] 
        lst_userid=['JohnC']
        random_userid = random.choice(lst_userid)
        return random_userid

    def generate_random_datetime(self, start_datetime, end_datetime):
        # Convert start and end datetimes to timestamps
        start_timestamp = start_datetime.timestamp()
        end_timestamp = end_datetime.timestamp()

        # Generate a random timestamp within the specified range
        random_timestamp = random.uniform(start_timestamp, end_timestamp)

        # Convert the random timestamp back to a datetime object
        random_datetime = datetime.fromtimestamp(random_timestamp)

        return random_datetime
    def run(self):
        begin_time = datetime.now()
        logging.info(f"Thread {self._threadID} start : {begin_time}")
        while (True):
            logging.info('Running...')
            try:
                # Create a cursor object
                order_id=f"{self._order_prefix}{self._order_id}"
                self._order_id=self._order_id+1

                userid=self.get_random_userid()
                #userid='JohnC'

                query = f'''
                select 
                orderid, 
                carid, 
                userid, 
                duration, 
                ordered as ordered_boolean,
                name,
                brand,
                from_date as from_date_ts,
                end_date as end_date_ts,
                order_when
                from public.orders 
                where userid = '{userid}'
                order by order_when desc
                '''


                #logging.info(query)
                cursor = self._conn.cursor()
                cursor.execute(query)
                results = cursor.fetchall()
                #logging.info(f"{query}")
                cursor.close()
                delta = datetime.now() - self._begin_time
                if( delta.total_seconds() > _TIME_INTERVAL):
                    logging.warning(f" passed the running interval: {_TIME_INTERVAL}")
                    self._begin_time = datetime.now()
                    self._conn.close()

                    logging.warning(f"Connection closed and restablish.")
                    self.connect_to_database()

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


    def __del__(self):
        # Close the cursor and connection
        self._conn.close()

def get_random_string(length):
    characters = string.ascii_letters + string.digits
    return ''.join(random.choice(characters) for _ in range(length))

_FILENAME=__file__
_THREADS_NUM=1
_HOST="10.0.30.111"
_TIME_INTERVAL=10
def getSysOpts():
    global _THREADS_NUM
    global _HOST
    global _TIME_INTERVAL
    usages = '''
    Usage: %s [OPTION]
    Start up pg load test
      -H help       show usage of the command
      -t threadnum  specifiy to start up how many threads
      -h hostname   specify the postgreSQL hostname or IP
      -i interval   specify the interval for connection re-stablish(Unit: seconds)
    Example for none HA manual failover:nohup %s -t 10
    ''' %(_FILENAME,_FILENAME)

    try:
        print('ARGV:', sys.argv[1:])
        opts, args = getopt.getopt(sys.argv[1:], 'Ht:h:i:')
        print(opts)
        for opt_name, opt_value in opts:
            if opt_name in ('-H'):
                print(usages)
                sys.exit()
            if opt_name in ('-t'):
                print("THREADS_NUM=", opt_value)
                _THREADS_NUM=int(opt_value)
                continue;
            if opt_name in ('-h'):
                print("HOST=", opt_value)
                _HOST=opt_value
                continue
            if opt_name in ('-i'):
                print("INTERVAL=", opt_value)
                _TIME_INTERVAL=int(opt_value)
                continue;
    except getopt.GetoptError as e:
        print ('ERROR: %s' % str(e))
        print(usages)
        sys.exit(2)

_DIRNAME=os.path.dirname(os.path.realpath(__file__))
logfile_import="%s/%s" %(_DIRNAME,"read.log")

logging.basicConfig(level=logging.INFO,
                    format='%(asctime)s %(filename)s[line:%(lineno)d] %(levelname)s %(message)s',
                    #datefmt='%a, %d %b %Y %H:%M:%S',
                    datefmt='%a, %Y-%m-%d %H:%M:%S',
                    filename=logfile_import,
                    filemode='a')

if __name__ == '__main__':
    #global _THREADS_NUM
    getSysOpts()

    logging.info(f"_THREADS_NUM:{_THREADS_NUM}")
    #_THREADS_NUM = 1
#    sys.exit(2)

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

    logging.info("Ooops...Done")
#需要处理的剩余文件，没有达到threads的个数，会走到这里= insertSyncTableThread(

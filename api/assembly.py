import pymongo

def db_connect():
    myclient = pymongo.MongoClient("mongodb+srv://chun:Icccc-9111@cluster0.yt7grdj.mongodb.net/test")
    mydb = myclient["tryMongo"]
    dblst = myclient.list_database_names()
    if "tryMongo" in dblst:
      print("database exists!")

    return mydb


def col_connect(colName):
    mycol = mydb[colName]
    collst = mydb.list_collection_names()
    if colName in collst:
        print("collection exists!")
        
    return mycol


def read_file():
    ids=[]
    ass=[]
    with open('../dot/output.dot') as f:
            for line in f:     
                temp = line.partition("\"")
                temp = temp[2].partition("\"")
                ass.append(temp[0])
                #print("ass:\n",ass)

                if (line.find("->")!=-1):
                    break

                for word in line.split():   
                    if (word.find("bb_") != -1):
                        ids.append(word)
    return ids, ass


mydb = db_connect()
colName = "assembly"
mycol = col_connect(colName)
ids, ass = read_file()
fileName="output.dot"

for i in range(len(ids)):
    data = {"fileName":fileName, "_id" : ids[i], "assembly" : ass[i+1]}
    mycol.insert_one(data)

for x in mycol.find():
  print(x)
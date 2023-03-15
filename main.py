from fastapi import FastAPI
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


mydb = db_connect()
app = FastAPI()


@app.get("/")
def read_root():
    return {"msg": "Hello!"}


@app.get("/type/{type}/filename/{fileName}/_id/{_id}")

def read_assembly(type,fileName,_id):
    colName = type
    if(type == "assembly"):
        mycol = col_connect(colName)
        
        return {"assembly": mycol.find({},{ "_id":_id, "fileName":fileName})}
    else:
        return {"error": "wrong request"}

@app.get("/type/{type}/filename/{fileName}/startNode/{startNode}/endNode/{endNode}")

def read_flow(type,fileName,startNode,endNode):
    colName = type
    if(type == "flow"):
        mycol = col_connect(colName)
        
        return {"flowType": mycol.find({},{ "fileName": fileName, "startNode": startNode, "endNode": endNode})}    
    else:
        return {"error": "wrong request"}
    
@app.get("/type/{type}/filename/{fileName}")

def read_graph(type,fileName):
    colName = type
    if(type == "graph"):
        mycol = col_connect(colName)
        
        return {"graph": mycol.find({},{ "fileName": fileName })}    
    else:
        return {"error": "wrong request"}
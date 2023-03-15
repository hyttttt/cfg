from flow import db_connect, col_connect, fileName

def read_graph():
    graph = ""
    with open('../dot/output.dot') as f:
            for line in f:    
                if (line.find("->")!=-1):
                     graph+=line
                     graph+=" "
    return graph

mydb = db_connect()
colName = "graph"
mycol = col_connect(colName)

graph = read_graph()
fileName = fileName

data = {"fileName":fileName, "graph" : graph}
mycol.insert_one(data)

for x in mycol.find():
  print(x)
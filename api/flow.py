from assembly import db_connect, col_connect, fileName

def read_graph():
    startNode=[]
    #targetNode=[]
    flow=[]
    with open('../dot/output.dot') as f:
            for line in f:    
                if (line.find("->")!=-1):
                    for word in line.split():   
                        if (word.find("bb_") != -1):
                            startNode.append(word)
                        if(word.find("flowType=")!=-1):
                            if(word.find("Conditional")!=-1):
                                word="Conditional Jump"
                                flow.append(word)
                            else:
                                flow.append(word[10:-2])
                            flow.append(" ")

    return startNode, flow

mydb = db_connect()
colName = "flow"
mycol = col_connect(colName)

startNode, flow = read_graph()
fileName = fileName

for i in range(0,len(startNode),2):
    data = {"fileName":fileName, "startNode" : startNode[i], "endNode" : startNode[i+1], "flowType": flow[i]}
    mycol.insert_one(data)

for x in mycol.find():
  print(x)
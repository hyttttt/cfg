#@author Mirror
#@category Functions
#@keybinding 
#@menupath 
#@toolbar 

from __future__ import division
import logging
import site
import sys
import os
import networkx as nx
import pickle
from networkx.drawing.nx_pydot import write_dot
from ghidra.program.model.block import BasicBlockModel
from ghidra.program.model.block import CodeBlockIterator
from ghidra.program.model.block import CodeBlockReference 
from ghidra.program.model.block import CodeBlockReferenceIterator 
from ghidra.program.model.listing import CodeUnitIterator;
from ghidra.program.model.listing import Function;
from ghidra.program.model.listing import FunctionManager;
from ghidra.program.model.listing import Listing;
from ghidra.program.database.code import InstructionDB

def addBB(bb, G, bb_func_map):
    listing = currentProgram.getListing();
    # iter over the instructions
    codeUnits = listing.getCodeUnits(bb, True)
    lastInstStart = 0x0
    lastInstEnd = 0x0

    bb_tbl_rows = ''
    i = 0
    firstInstStart = 0
    while codeUnits.hasNext():
        codeUnit = codeUnits.next()
        # check if the code unit is the instruction
        #if not isinstance(codeUnit, type(InstructionDB)):
        #    continue
        if not str(codeUnit.getClass())=="class ghidra.program.database.code.InstructionDB":
            continue
        #print(InstructionDB.getClass())
        # Record address of first instruction
        if i == 0:
            firstInstStart = codeUnit.getAddress().getOffset()

        lastInstStart = codeUnit.getAddress().getOffset()
        lastInstEnd = lastInstStart + codeUnit.getLength()
	
        bb_tbl_rows+=(f"{lastInstStart}: {codeUnit}\n")
        i += 1 # Bump Counter

    bb_func_map[bb.getMinAddress().getOffset()] = \
        'bb_%x:insn_%x' % (bb.getMinAddress().getOffset(), firstInstStart)

    # add node
    G.add_nodes_from([('bb_%x' % (bb.getMinAddress().getOffset()),{"assembly":bb_tbl_rows})])

def addSuccessors(bb_func_set, bb_func_map, G):


    listing = currentProgram.getListing();
    for bb in bb_func_set:
        codeUnits = listing.getCodeUnits(bb, True)
        lastInstStart = 0x0
        lastInstEnd = 0x0

        cur_bb_str = bb_func_map[bb.getMinAddress().getOffset()]
        successors=bb.getDestinations(monitor)
        while codeUnits.hasNext():
            codeUnit = codeUnits.next()

            #if not isinstance(codeUnit, type(InstructionDB)):
            #    continue
            if not str(codeUnit.getClass())=="class ghidra.program.database.code.InstructionDB":
                continue
            lastInstStart = codeUnit.getAddress().getOffset()
            lastInstEnd = lastInstStart + codeUnit.getLength()
            successors = bb.getDestinations(monitor)

        idx = 0
        sucSet = set()
        while successors.hasNext():
            sucBBRef = successors.next()
            sucBBRefAddr = sucBBRef.getReferent().getOffset()
            # the reference is not in the last instruction
            if sucBBRefAddr < lastInstStart or sucBBRefAddr >= lastInstEnd:
                continue

            sucBB = sucBBRef.getDestinationBlock()
            sucOffset = sucBB.getFirstStartAddress().getOffset()
            if sucOffset in sucSet:
                continue

            if sucOffset not in bb_func_map:
                continue

            idx += 1

            currInsnAddr = sucBBRef.getReferent().getOffset()
            currBBAddr = bb.getMinAddress().getOffset()
            flowType = sucBBRef.getFlowType()

            if (flowType.isJump() and flowType.isUnConditional()) or flowType.isFallthrough():
                edgeAttrs = 'Jump'
            elif flowType.isCall() and flowType.isUnConditional():
                edgeAttrs = 'Call'
            elif flowType.isJump() and flowType.isConditional():
                edgeAttrs = 'Conditional Jump'
            elif flowType.isCall() and flowType.isConditional():
                edgeAttrs = 'Conditional Call'
            else:
                edgeAttrs = 'Other'

            G.add_edge('bb_%x' % (currBBAddr),f"{bb_func_map[sucOffset].split(':')[0]}",flowType=edgeAttrs)

            sucSet.add(sucOffset)

def dumpBlocks():
    bbModel = BasicBlockModel(currentProgram)
    functionManager = currentProgram.getFunctionManager()

    # record the basic block that has been added by functions
    bb_set = set()
    # get all functions
    funcs_set = set()
    for func in functionManager.getFunctions(True):
        #if func.getName() != "main":
        #    continue
        # we skip external functions
        if func.isExternal():
            continue

        func_va = func.getEntryPoint().getOffset()
        if func_va in funcs_set:
            continue
        #print(func.getName(),hex(func_va))
        G = nx.DiGraph()
        funcs_set.add(func_va)
        codeBlockIterator = bbModel.getCodeBlocksContaining(func.getBody(), monitor);


        # iter over the basic blocks
        bb_func_map = dict()
        bb_func_set = set()
        while codeBlockIterator.hasNext(): 
            bb = codeBlockIterator.next()
            bb_set.add(bb.getMinAddress().getOffset())
            bb_func_set.add(bb)
            addBB(bb, G, bb_func_map)

        addSuccessors(bb_func_set, bb_func_map, G)
        if not os.path.isdir(f'/home/gradle/tmp/'):
            os.mkdir(f'/home/gradle/tmp/')
        write_dot(G,f"/home/gradle/tmp/{func.getName()}.dot")


import time
start_time = time.time()
dumpBlocks()
print("--- %s seconds ---" % (time.time() - start_time))

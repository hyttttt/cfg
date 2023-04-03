# @author Mirror
# @category Functions
# @keybinding
# @menupath
# @toolbar

from __future__ import division
import logging
import site
import sys
import os
import networkx as nx
import pickle
from networkx.drawing.nx_pydot import write_dot

try:
    from ghidra.ghidra_builtins import *
except:
    pass
from ghidra.program.model.block import BasicBlockModel
from ghidra.program.model.block import SimpleBlockModel
from ghidra.program.model.util import AcyclicCallGraphBuilder
from ghidra.program.model.block import CodeBlockIterator
from ghidra.program.model.block import CodeBlockReference
from ghidra.program.model.block import CodeBlockReferenceIterator
from ghidra.program.model.listing import CodeUnitIterator;
from ghidra.program.model.listing import Function;
from ghidra.program.model.listing import FunctionManager;
from ghidra.program.model.listing import Listing;
from ghidra.program.database.code import InstructionDB


def addBB(bb, G, bb_func_map):
    listing = currentProgram.getListing()
    functionManager = currentProgram.getFunctionManager()
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
        # if not isinstance(codeUnit, type(InstructionDB)):
        #    continue
        if not str(codeUnit.getClass()) == "class ghidra.program.database.code.InstructionDB":
            continue
        # print(InstructionDB.getClass())
        # Record address of first instruction
        if i == 0:
            firstInstStart = codeUnit.getAddress().getOffset()

        lastInstStart = codeUnit.getAddress().getOffset()
        lastInstEnd = lastInstStart + codeUnit.getLength()

        bb_tbl_rows += (f"{lastInstStart}: {codeUnit}\n")
        i += 1  # Bump Counter

    bb_func_map[bb.getMinAddress().getOffset()] = \
        'bb_%x:insn_%x' % (bb.getMinAddress().getOffset(), firstInstStart)
    if functionManager.getFunctionContaining(bb.getMinAddress()) is not None:
        G.add_nodes_from([('bb_%x' % (bb.getMinAddress().getOffset()),{"function": functionManager.getFunctionContaining(bb.getMinAddress()).getName(),"assembly": bb_tbl_rows})])
    else:
        G.add_nodes_from([('bb_%x' % (bb.getMinAddress().getOffset()), {"assembly": bb_tbl_rows})])


def addSuccessors(bb_func_set, bb_func_map, G, called_address):
    listing = currentProgram.getListing()
    for bb in bb_func_set:
        codeUnits = listing.getCodeUnits(bb, True)
        lastInstStart = 0x0
        lastInstEnd = 0x0

        cur_bb_str = bb_func_map[bb.getMinAddress().getOffset()]
        successors = bb.getDestinations(monitor)
        while codeUnits.hasNext():
            codeUnit = codeUnits.next()

            # if not isinstance(codeUnit, type(InstructionDB)):
            #    continue
            if not str(codeUnit.getClass()) == "class ghidra.program.database.code.InstructionDB":
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

            if flowType.isFallthrough():
                edgeAttrs = 'Fall'
            elif (flowType.isJump() and flowType.isUnConditional()):
                edgeAttrs = 'Jump'
            elif flowType.isCall() and flowType.isUnConditional():
                edgeAttrs = 'Call'
                if sucBB.getFirstStartAddress() not in called_address:
                    called_address[sucBB.getFirstStartAddress()] = []
                called_address[sucBB.getFirstStartAddress()].append(codeUnit.getAddress())
            elif flowType.isJump() and flowType.isConditional():
                edgeAttrs = 'Conditional Jump'
            elif flowType.isCall() and flowType.isConditional():
                edgeAttrs = 'Conditional Call'
                if sucBB.getFirstStartAddress() not in called_address:
                    called_address[sucBB.getFirstStartAddress()] = []
                called_address[sucBB.getFirstStartAddress()].append(codeUnit.getAddress())
            else:
                edgeAttrs = 'Other'

            G.add_edge('bb_%x' % (currBBAddr), f"{bb_func_map[sucOffset].split(':')[0]}", flowType=edgeAttrs)

            sucSet.add(sucOffset)


def addCallSuccessors(called_address, G):
    functionManager = currentProgram.getFunctionManager()
    listing = currentProgram.getListing()
    bbModel = SimpleBlockModel(currentProgram)
    for func_address, called_list in called_address.items():
        ret_address = functionManager.getFunctionAt(func_address).getBody().getMaxAddress()
        bb_address = bbModel.getFirstCodeBlockContaining(ret_address, monitor).getFirstStartAddress().getOffset()
        for called_func in called_list:
            after_called_address = listing.getCodeUnitAfter(called_func).getAddress().getOffset()
            G.add_edge('bb_%x' % (bb_address), 'bb_%x' % (after_called_address), flowType='Return')


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
        called_address = dict()
        funcs_set.add(func_va)
        codeBlockIterator = bbModel.getCodeBlocksContaining(func.getBody(), monitor)


        # iter over the basic blocks
        bb_func_map = dict()
        bb_func_set = set()
        while codeBlockIterator.hasNext():
            bb = codeBlockIterator.next()
            bb_set.add(bb.getMinAddress().getOffset())
            bb_func_set.add(bb)
            addBB(bb, G, bb_func_map)

        addSuccessors(bb_func_set, bb_func_map, G,called_address)
        if not os.path.isdir(f'/home/gradle/tmp/'):
            os.mkdir(f'/home/gradle/tmp/')
        write_dot(G,f"/home/gradle/tmp/{func.getName()}.dot")


def dumpEntryBlocks():
    bbModel = SimpleBlockModel(currentProgram)
    functionManager = currentProgram.getFunctionManager()
    functionCalls = []
    findCalls(functionCalls)
    addressSet = functionManager.getFunctionAt(functionCalls[0]).getBody()
    for func in functionCalls:
        addressSet = addressSet.union(functionManager.getFunctionAt(func).getBody())
    # record the basic block that has been added by functions
    bb_set = set()
    # get all functions
    funcs_set = set()
    codeBlockIterator = bbModel.getCodeBlocksContaining(addressSet, monitor)
    bb_func_map = dict()
    bb_func_set = set()
    G = nx.DiGraph()
    called_address = dict()
    while codeBlockIterator.hasNext() and len(bb_func_set) < 20:
        bb = codeBlockIterator.next()
        bb_set.add(bb.getMinAddress().getOffset())
        bb_func_set.add(bb)
        addBB(bb, G, bb_func_map)
    addSuccessors(bb_func_set, bb_func_map, G, called_address)
    addCallSuccessors(called_address, G)
    if not os.path.isdir(f'/home/gradle/tmp/'):
        os.mkdir(f'/home/gradle/tmp/')
    write_dot(G,f"/home/gradle/tmp/entry.dot")

def findCalls(functionCalls):
    functionManager = currentProgram.getFunctionManager()
    for func in functionManager.getFunctions(True):
        if func.getName() == "main" or func.getName() == "entry": #or func.getName()=="_start" or func.getName()=="_init":
            functionCalls.append(func.getEntryPoint())
    graph = AcyclicCallGraphBuilder(currentProgram, False).getDependencyGraph(monitor)
    flag = True
    while flag:
        flag = False
        for entry in graph.getNodeMap().entrySet():
            address = entry.getKey()
            dependNodeSet = entry.getValue().getSetOfNodesThatDependOnMe()
            if dependNodeSet is None:
                continue
            for node in dependNodeSet:
                if address not in functionCalls and node.getValue() in functionCalls:
                    flag = True
                    functionCalls.append(address)


def dumpWholeBlocks():
    bbModel = SimpleBlockModel(currentProgram,True)
    functionManager = currentProgram.getFunctionManager()
    codeBlockIterator=bbModel.getCodeBlocks(monitor)

    # record the basic block that has been added by functions
    bb_set = set()
    # get all functions
    funcs_set = set()

    bb_func_map = dict()
    bb_func_set = set()

    G = nx.DiGraph()
    called_address = dict()
    while codeBlockIterator.hasNext():
        bb = codeBlockIterator.next()
        bb_set.add(bb.getMinAddress().getOffset())
        bb_func_set.add(bb)
        addBB(bb, G, bb_func_map)

    addSuccessors(bb_func_set, bb_func_map, G, called_address)
    addCallSuccessors(called_address, G)
    if not os.path.isdir(f'/home/gradle/tmp/'):
       os.mkdir(f'/home/gradle/tmp/')
    write_dot(G,f"/home/gradle/tmp/whole.dot")

import time

start_time = time.time()
dumpBlocks()
dumpEntryBlocks()
dumpWholeBlocks()
print("--- %s seconds ---" % (time.time() - start_time))

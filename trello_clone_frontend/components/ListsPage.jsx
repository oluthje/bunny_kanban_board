import React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { Button, Card, Dialog, DialogTitle, DialogActions, DialogContent, TextField, Grid } from '@mui/material';
import update from "immutability-helper";
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import List from './List';
import { getLists, addList, deleteList, switchLists } from '../services/ListServices.js';
import { useRouter } from 'next/navigation';
import { getCookie } from 'cookies-next';
import Link from 'next/link';

export const ItemTypes = {
  LIST: 'list',
  CARD: 'card',
}

export default function ListsPage({ user_id }) {
  const [lists, setLists] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [user, setUser] = useState(null);
  const listRef = React.useRef();
  listRef.current = lists;
  const router = useRouter();

  useEffect(() => {
    handleGetLists(user_id)
  }, []);

  useEffect(() => {
    let userCookie = getCookie('user')
    if (userCookie) {
      setUser(JSON.parse(userCookie))
      console.log(JSON.parse(userCookie))
    }
  }, [])

  const handleGetLists = async () => {
    getLists(user_id)
      .then(lists => setLists(lists.sort((a, b) => a.orderId - b.orderId)))
  }

  const handleAddList = async (title) => {
    addList(title, user_id)
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          alert(data.error)
        } else {
          setLists([...lists, data])
        }
      });
  }

  const handleDeleteList = async (listId) => {
    deleteList(listId, user_id)
      .then(data => setLists(lists.filter(list => list.id !== listId)));
  }

  const moveList = useCallback((dragIndex, hoverIndex) => {
    switchLists(listRef.current[dragIndex].id, listRef.current[hoverIndex].id, user_id)
    setLists((prevLists) => 
      update(prevLists, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, prevLists[dragIndex]],
        ],
      })
    )
  }, [])

  let listComponents = lists && lists.map((list, index) => (
    <List
      title={list.title}
      id={list.id}
      key={list.id}
      onDeleteList={handleDeleteList}
      index={index}
      moveList={moveList}
      user_id={user_id}
      cards_allowed={user && user.cards_allowed}
    />
  ))

  let totalLists = lists && lists.length

  return (
    <div>
      {user && <h1 style={{ color: "red" }} >Lists: {totalLists} / {user.lists_allowed}</h1>}
      <Grid id="top-row" container >
        <DndProvider backend={HTML5Backend}>{listComponents}</DndProvider>
        <Card style={{ backgroundColor: "black" }} sx={{ m: 1, minWidth: 275 }}>
          <Button style={{ color: "white" }} onClick={() => setDialogOpen(true)}>Add List</Button>
        </Card>
      </Grid>
      <Button
        onClick={() => {
          router.back();
        }}
      >Sign Out</Button>
      {user && <Link href={user.bunny_portal_link} replace >Manage Subscription</Link>}
      <NewListDialog
        open={dialogOpen}
        handleClose={() => setDialogOpen(false)}
        handleAddList={handleAddList}
      ></NewListDialog>
    </div>
  );
}

function NewListDialog({ open, handleAddList, handleClose }) {
  const [text, setText] = useState('');

  const addList = () => {
    handleAddList(text);
    handleClose();
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add List</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="New list name"
          type="text"
          fullWidth
          variant="standard"
          text={text}
          onChange={(e) => setText(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={() => addList()}>Add list</Button>
      </DialogActions>
    </Dialog>
  )
}

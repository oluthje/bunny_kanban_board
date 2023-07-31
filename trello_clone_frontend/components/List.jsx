import React from 'react';
import { Card, IconButton, Grid, Button, TextField, Box } from '@mui/material';
import ListCard from './ListCard';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState, useEffect, useRef, useCallback } from 'react';
import { getCards, addCard, deleteCard, switchCards } from '../services/CardServices.js';
import { ItemTypes } from './ListsPage.jsx';
import { useDrag, useDrop } from 'react-dnd';
import update from "immutability-helper";

export default function List({title, id, onDeleteList, moveList, index, user_id, cards_allowed}) {
  const [text, setText] = useState("");
  const [cards, setCards] = useState([]);
  const cardRef = React.useRef();
  cardRef.current = cards;
  const ref = useRef(null)
  const [{ handlerId, isOver }, drop] = useDrop({
    accept: ItemTypes.LIST,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
        isOver: !!monitor.isOver(),
      }
    },
    hover(item, monitor) {
      if (!ref.current) {
        return
      }
      const dragIndex = item.index
      const hoverIndex = index
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return
      }
      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect()
      // Get vertical middle
      const hoverMiddleX =
        (hoverBoundingRect.right - hoverBoundingRect.left) / 2
        
      // Determine mouse position
      const clientOffset = monitor.getClientOffset()
      // Get pixels to the top
      const hoverClientX = clientOffset.x - hoverBoundingRect.left
      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientX < hoverMiddleX) {
        return
      }
      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientX > hoverMiddleX) {
        return
      }

      // Time to actually perform the action
      moveList(dragIndex, hoverIndex)
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex
    },
  })
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.LIST,
    item: () => {
      return { id, index };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });

  useEffect(() => {
    handleGetCards(user_id)
  }, [])

  const handleGetCards = async () => {
    getCards(id, user_id)
      .then(cards => setCards(cards.sort((a, b) => a.orderId - b.orderId)));
  }

  const handleAddCard = async (title) => {
    addCard(title, id, user_id)
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          alert(data.error)
        } else {
          setCards([...cards, data])
        }
      });
  }

  const handleDeleteCard = async (cardId) => {
    deleteCard(cardId, id, user_id)
      .then(data => setCards(cards.filter(card => card.id !== cardId)));
  }

  const moveCard = useCallback((dragIndex, hoverIndex, sourceListId, targetListId, cardId) => {
    if (sourceListId !== targetListId) {
      // console.log("listname: " + id + ", from list" + sourceListId + " to list " + targetListId)
      // delete the card
      // deleteCard(cardId, sourceListId)
    } else {
      switchCards(cardRef.current[dragIndex].id, cardRef.current[hoverIndex].id, sourceListId, user_id)
      setCards((prevCards) => 
        update(prevCards, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, prevCards[dragIndex]],
          ],
        })
      )
    }
    // console.log("from list" + parentListId + " to list " + id)
  }, [])

  // if moved card to a different list.
  //  delete card from its current list
  //  add card to new list with new order id, passing it to rails as optional param.

  let cardComponents = cards && cards.map((card, index) => {
    return (
      <ListCard
        title={card.title}
        id={card.id}
        key={card.id}
        onDeleteListCard={handleDeleteCard}
        index={index}
        moveCard={moveCard}
        parentListId={id}
      />
    )
  })

  let totalCards = cards && cards.length

  drag(drop(ref));

  return (
    <div
      ref={ref}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: 'move',
      }}
    > 
      <Card sx={{ m: 1, minWidth: 150 }}>
        <h1 style={{ color: 'red' }} >Cards: {totalCards} / {cards_allowed}</h1>
        <Grid
          id="top-row"
          container
          justifyContent={"space-between"}
        >
          <Box sx={{ fontWeight: 'bold', m: 1 }}>{title}</Box>
          <IconButton
            aria-label="delete"
            onClick={() => onDeleteList(id)}
          >
            <DeleteIcon />
          </IconButton>
        </Grid>
        <Grid
        >
          {cardComponents}
        </Grid>
        <TextField
          value={text}
          onChange={(e) => setText(e.target.value)}
        ></TextField>
        <Button
          onClick={() => {
            if (text.length > 0) {
              handleAddCard(text);
              setText("");
            }
          }}
        >Add card</Button>
      </Card>
    </div>
  )
}
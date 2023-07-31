import React from 'react';
import { Card, IconButton, Grid } from '@mui/material';
import { useRef } from 'react';
import { ItemTypes } from './ListsPage.jsx';
import { useDrag, useDrop } from 'react-dnd';
import DeleteIcon from '@mui/icons-material/Delete';

export default function ListCard({title, id, parentListId, onDeleteListCard, moveCard, index}) {
  const ref = useRef(null)
  const [{ handlerId, isOver }, drop] = useDrop({
    accept: ItemTypes.CARD,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
        isOver: !!monitor.isOver(),
      }
    },
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      // Don't replace items with themselves
      if (dragIndex === hoverIndex && item.parentListId === parentListId) {
        return;
      }
      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      // Determine mouse position
      const clientOffset = monitor.getClientOffset();
      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // console.log("item.parentListId: " + item.parentListId + " parentListId: " + parentListId);
      // console.log("sourceListId: " + item.parentListId + " targetListId: " + parentListId + " dragIndex: " + dragIndex + " hoverIndex: " + hoverIndex);

      // Time to actually perform the action
      const sourceListId = item.parentListId;
      const targetListId = parentListId;
      moveCard(dragIndex, hoverIndex, sourceListId, targetListId, item.id);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  })
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.CARD,
    item: () => {
      return { id, index, parentListId };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });

  drag(drop(ref));
  
  return (
    <div
      ref={ref}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: 'move',
      }}
    >
      <Card variant="outlined">
        <Grid id="top-row" container justifyContent={"space-between"}>
          <h1>{title}</h1>
          <IconButton
              aria-label="delete"
              onClick={() => onDeleteListCard(id)}
          >
            <DeleteIcon />
          </IconButton>
        </Grid>
      </Card>
    </div>
  )
}

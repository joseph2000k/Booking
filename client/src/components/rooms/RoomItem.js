import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from 'react-bootstrap';

const RoomItem = ({ room: { _id, name } }) => (
  <Link
    className='mx-4'
    to={`/meeting/${_id}`}
    style={{ textDecoration: 'none', color: 'black' }}
    variant='primary'
  >
    <Card style={{ width: '18rem' }}>
      <Card.Img variant='top' src={`img/${_id}.jpg`} />
      <Card.Body>
        <Card.Title>{name}</Card.Title>
        <Card.Text>Room Description</Card.Text>
      </Card.Body>
    </Card>
  </Link>
);

export default RoomItem;

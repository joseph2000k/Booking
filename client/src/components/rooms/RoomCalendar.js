import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';

const RoomCalendar = () => (
  <div>
    <FullCalendar
      defaultView='dayGridMonth'
      plugins={[dayGridPlugin]}
      events={[{ id: 'a', title: 'Finance', start: '2021-10-23' }]}
    />
  </div>
);

export default RoomCalendar;

import React, { useState } from "react";
import { MdDeleteOutline } from "react-icons/md";
import { IoCloseOutline } from "react-icons/io5";
import { AiTwotoneClockCircle } from "react-icons/ai";
import { CgNotes } from "react-icons/cg";
import { TiTickOutline } from "react-icons/ti";
import Modal from 'react-bootstrap/Modal';
import { useDispatch, useSelector } from "react-redux";
import { setSavedEventsDupli, updateSavedEvents, updateShowEventModal } from "../../Storage/CalenderSlice/CalenderSlice";

const labelsClasses = [
  "info",
  "secondary",
  "success",
  "primary",
  "danger"
];

export default function EventModal() {
  const CalenderSlice = useSelector((state) => state.calender);
  const dispatch = useDispatch();

  const [title, setTitle] = useState(
    CalenderSlice.selectedEvent ? CalenderSlice.selectedEvent.title : ""
  );

  const [time,setTime] = useState(
    CalenderSlice.selectedEvent ? CalenderSlice.selectedEvent.time : ""
  );

  const [description, setDescription] = useState(
    CalenderSlice.selectedEvent ? CalenderSlice.selectedEvent.description : ""
  );

  const [selectedLabel, setSelectedLabel] = useState(
    CalenderSlice.selectedEvent
      ? labelsClasses.find((lbl) => lbl === CalenderSlice.selectedEvent.label)
      : labelsClasses[0]
  );

  function handleSubmit() {
    const calendarEvent = {
      title,
      description,
      label: selectedLabel,
      time:time,
      day: CalenderSlice.daySelected.valueOf(),
      id: CalenderSlice.selectedEvent ? CalenderSlice.selectedEvent.id : Date.now(),
    };

    if (title !== '' && description !== '' && time ) {
         
      if (CalenderSlice.selectedEvent) {
        const updateEvents = CalenderSlice.savedEvents.map((evt) =>
          evt.id === calendarEvent.id ? calendarEvent : evt
        );
        dispatch(setSavedEventsDupli(updateEvents))
        dispatch(updateSavedEvents(updateEvents))
      } else {
        const pushEvents = [...CalenderSlice.savedEvents, calendarEvent]
        dispatch(setSavedEventsDupli(pushEvents))
        dispatch(updateSavedEvents(pushEvents))
      }
      dispatch(updateShowEventModal(false));
    } else {
      alert("some fields are missing")
    }
  }

  const handleDeleteSelectedEvents = () => {
    const deleteEvent = CalenderSlice.savedEvents.filter((evt) => evt.id !== CalenderSlice.selectedEvent.id);
    dispatch(setSavedEventsDupli(deleteEvent))
    dispatch(updateSavedEvents(deleteEvent))
    dispatch(updateShowEventModal(false));
  }

  return (

    <Modal
      show={CalenderSlice.showEventModal}
      backdrop="static"
      keyboard={false}
      centered
    >
      <Modal.Body>
        <div className="col-12">
          <form className="calendar-modal-content">
            <header className=" d-flex justify-content-end align-items-center">
              <div>
                {CalenderSlice.selectedEvent && (
                  <button type="button"
                    onClick={() => {
                      handleDeleteSelectedEvents()
                    }}
                    className="bg-transparent border-0 me-2"
                  >
                    <MdDeleteOutline className="fs-4" />
                  </button>
                )}
                <button type="button" onClick={() => dispatch(updateShowEventModal(false))} className="bg-transparent border-0">
                  <IoCloseOutline className="fs-3" />
                </button>
              </div>
            </header>
            <div className="p-3">
              <div className="d-flex flex-wrap">
                <div className="col-12 row align-items-center mb-4">
                  <div className="col-2">
                    <p className="mb-0">
                      Title
                    </p>
                  </div>
                  <div className="col-10">
                    <input
                      type="text"
                      name="title"
                      placeholder="Add title"
                      value={title}
                      required
                      className="col-12 pt-3 border-0 border-bottom"
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>
                </div>

                <div className="col-12 row align-items-center mb-3">
                  <div className="col-2">
                    <p className="mb-0">
                      <AiTwotoneClockCircle />
                    </p>
                  </div>
                  <div className="col-2">
                    <p className="mb-0">{CalenderSlice.daySelected}</p>
                  </div>
                  <div className="col-3">
                    <input type="time" className="form-control" value={time} onChange={(e)=>setTime(e.target.value)}/>
                  </div>
                </div>

                

                <div className="col-12 row align-items-center mb-3">
                  <div className="col-2">
                    <p className="mb-0">
                      <CgNotes />
                    </p>
                  </div>
                  <div className="col-10">
                    <input
                      type="text"
                      name="description"
                      placeholder="Add a description"
                      value={description}
                      required
                      className="col-12 pt-3 border-0 border-bottom"
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                </div>

                <div className="d-flex">
                  {labelsClasses.map((lblClass, i) => (
                    <span
                      key={i}
                      onClick={() => setSelectedLabel(lblClass)}
                      className={`bg-${lblClass} `}
                    >

                    </span>
                  ))}

                  {labelsClasses.map((lblClass, i) => (
                    <div
                      key={i}
                      onClick={() => setSelectedLabel(lblClass)}
                      className={`bg-${lblClass} calender-color me-2 position-relative`}
                    >
                      {selectedLabel === lblClass && (
                        <TiTickOutline className="fs-2 text-light tick-symbol" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </form>

          <div className="d-flex flex-wrap justify-content-end me-3 py-3">
            <button
              type="button"
              onClick={handleSubmit}
              className="btn btn-primary"
            >
              Save
            </button>
          </div>
        </div>
      </Modal.Body>

    </Modal>



  );
}
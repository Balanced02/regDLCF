import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

export default ({ title, confirmText, confirmButtonText, handleConfirmation, show, toggle, fetching }) => 
       <div>
        <Modal isOpen={show} toggle={toggle}>
          <ModalHeader toggle={toggle}>{title}</ModalHeader>
          <ModalBody>
            <p>{confirmText}</p>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={handleConfirmation} disabled={fetching} >{confirmButtonText}</Button>{' '}
            <Button color="secondary" onClick={toggle} disabled={fetching} >Cancel</Button>
          </ModalFooter>
        </Modal>
      </div>

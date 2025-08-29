import { useState } from "react";
import { ModalContext } from "./ModalContext";
import PropTypes from "prop-types";

const ModalContextProvider = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalHandle = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <ModalContext.Provider value={{ isModalOpen, modalHandle }}>
      {children}
    </ModalContext.Provider>
  );
};

ModalContextProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export default ModalContextProvider;

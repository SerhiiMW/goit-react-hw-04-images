import styles from "./modal.module.css"

import { useEffect } from "react";
import { createPortal } from "react-dom";


const modalRoot = document.getElementById("modal-root");


const Modal = ({close, children}) => {
    const closeModal = ({target, currentTarget, code})=> {
        if(target === currentTarget || code === "Escape") {
            close()
        }
    }

    useEffect(()=> {
        document.addEventListener("keydown", closeModal);

        return ()=> document.removeEventListener("keydown", closeModal);
    })

    return createPortal(
        (<div onClick={closeModal} className={styles.Overlay}>
            <div className={styles.Modal}>
                <span onClick={close} className={styles.close}>X</span>
                {children}
            </div>
        </div>),
        modalRoot
    )
}

export default Modal;
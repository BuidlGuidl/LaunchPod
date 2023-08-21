/**
 * Modal component: A reusable modal component.
 */
type Props = {
    trigger: JSX.Element;
    modalTitle?: string;
    modalContent: JSX.Element;
    action?: {
      label: string;
      onClick: () => void;
    };
  };
  
const Modal: React.FC<Props> = ({ trigger, modalTitle, modalContent, action }) => {
    return (
        <div>
            <label htmlFor={`modal-${modalTitle}`} className="items-center flex">
                {trigger}
            </label>

            {/* Checkbox for toggling the modal. */}
            <input type="checkbox" id={`modal-${modalTitle}`} className="modal-toggle" />
            <div className="modal">
                <div className="modal-box">
                    {/* Close button for the modal. */}
                    <label htmlFor={`modal-${modalTitle}`} className="btn btn-sm btn-circle absolute right-2 top-2">
                        ✕
                    </label>
                    {/* Modal title. */}
                    <h3 className="font-bold text-center uppercase py-2 text-lg">{modalTitle}</h3>
                    {/* Modal content. */}
                    {modalContent}
                    {action && (
                        <div className="modal-action">
                            <button onClick={action.onClick} className="btn btn-primary ml-2">
                                {action.label}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
  
export default Modal;
  

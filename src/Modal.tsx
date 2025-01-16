import React, { useState } from "react";
import clsx from "clsx";

type ModalProps = {
    modal: boolean;
    setModal: (value: boolean) => void;
    onlyStarred: boolean;
    setOnlyStarred: (value: boolean) => void;
}

const Modal: React.FC<ModalProps> = ({ modal, setModal, onlyStarred, setOnlyStarred }) => {
    // Local state for managing the checkbox value within the modal
    const [tempOnlyStarred, setTempOnlyStarred] = useState(onlyStarred);

    const handleSave = () => {
        setOnlyStarred(tempOnlyStarred); // Save the temporary state to the main state
        setModal(false); // Close the modal
    };

    const handleClose = () => {
        setTempOnlyStarred(onlyStarred); // Reset temporary state to the original state
        setModal(false); // Close the modal
    };

    return (
        <div
            id="modal"
            className={clsx(
                "fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center",
                modal ? "visible" : "hidden"
            )}
        >
            <div className="bg-gray-800 w-full max-w-xl min-h-80 rounded-lg p-8 flex flex-col justify-between">
                <div>
                    <h2 className="text-white text-xl font-bold mb-8">Beállítások</h2>
                    <label className="inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={tempOnlyStarred}
                            onChange={(e) => setTempOnlyStarred(e.target.checked)}
                            className="sr-only peer"
                        />
                        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
              Csak csillagozottak megjelenítése
            </span>
                    </label>
                </div>
                <div className="flex justify-center gap-4">
                    <button
                        onClick={handleClose}
                        className="mt-4 p-2 border border-gray-700 bg-red-600 text-white rounded-md"
                    >
                        Bezárás
                    </button>
                    <button
                        onClick={handleSave}
                        className="mt-4 p-2 bg-blue-600 text-white rounded-md"
                    >
                        Mentés
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Modal;

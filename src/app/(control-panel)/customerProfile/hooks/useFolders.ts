import { useState } from "react";

export const useFolders = () => {
    const [openSections, setOpenSections] = useState({
        cliente: false,
        polizas: false,
        reclamos: false,
        polizasItems: {},
        reclamosItems: {},
    });

    const toggle = (key: string) => {
        setOpenSections((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    const toggleNested = (
        type: "polizasItems" | "reclamosItems",
        key: string,
    ) => {
        setOpenSections((prev) => ({
            ...prev,
            [type]: {
                ...prev[type],
                [key]: !prev[type][key],
            },
        }));
    };

    return {
        openSections,
        toggle,
        toggleNested,
    };
};
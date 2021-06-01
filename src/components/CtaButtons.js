import React from "react";
import get from "lodash.get";
import Action from "./Action";

function CtaButtons(props) {
    const actions = get(props, "actions", []);

    return (actions.map((action, action_idx) => {
            return (
                <Action key={action_idx} action={action} />
            );
        })
    );
}

export default CtaButtons;

import React, { Dispatch, SetStateAction, useState } from "react";

function DirectoryItem() {
    return (
        <div className="stripe-item">
            <img src={"/icons/folder.svg"} className="stripe-img"></img>
            <a href="https://github.com/ghuser-io/github-contribs/blob/master/index.js">Example 2</a>
        </div>
    )
}

export default DirectoryItem
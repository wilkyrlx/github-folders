import React, { Dispatch, SetStateAction, useState } from "react";

function RepoItem() {
    return (
        <div className="stripe-item">
            <img src={"/icons/command-line.svg"} className="stripe-img"></img>
            <a href="https://github.com/ghuser-io/github-contribs/blob/master/index.js">Example</a>
        </div>
    )
}

export default RepoItem
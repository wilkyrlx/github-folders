function Settings() {

    return (
        <div className="settings">
            <h3>Link your Github Account</h3>
            {/* wrap this to preserve state*/}
            <button id="github-button">Link Account</button>
            <br></br>
        </div>
    )
}

export { Settings }
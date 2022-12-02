import '../styles/Settings.css';


function Settings() {

    return (
        <div id="settings">
            <h3>Link your Github Account</h3>
            {/* wrap this to preserve state*/}
            <a href='#' style={{textDecoration:"none"}}>
                <button type="button" className="button">
                    <span className="button_text">Link Account</span>
                    <span className="button_icon">
                        <img src='/icons/github-logo.png' className='github-img'></img>
                    </span>
                </button>
            </a>
            <br></br>
        </div>
    )
}

export { Settings }
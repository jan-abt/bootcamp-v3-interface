function Tabs({ tabs, setCondition }) {

    /**
     * 
     * @param {*} evt 
     * @param {*} tabs 
     * Assumes that we have two tabs.
     * If the selected tab is the first tab
     * then the other one is set to "non-active"
     * and vice versa.
     * 
     */
    function tabHandler(evt, tabs) {
        if (evt.target.className === tabs[0].ref.current.className) {
            tabs[1].ref.current.className = 'tab'
            setCondition(true)
        } else {
            tabs[0].ref.current.className = 'tab'
            setCondition(false)
        }
        evt.target.className = 'tab tab--active'

    }

    return (
        <div className="tabs">
            {tabs && tabs.map((tab, index) => (
                <button
                    key={index}
                    onClick={(e) => tabHandler(e, tabs)}
                    ref={tab.ref}
                    className={`tab ${tab.default && "tab--active"}`}
                >
                    {tab.name}
                </button>
            ))}
        </div>

    );
}

export default Tabs;
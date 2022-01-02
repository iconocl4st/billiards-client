import React, {useState} from 'react';
import {Colors} from "./styles";

// const NUM_CONTENT_COLS = 3;

const NAVIGATION_STYLE = {
    position: 'absolute',
    width: '98%',
    left: '1%',
    top: 10,
    display: 'grid',
    gridGap: 5,
    gridTemplateColumns: '20% 20% 20% 20% 20%',
    background: Colors.contentItems,
};

const NAVIGATION_ITEM_STYLE = {
    display: 'grid',
    placeItems: 'center',
    backgroundColor: Colors.navItems,
    color: Colors.textColor,
    border: '1px solid ' + Colors.textColor
};

const CONTENT_STYLE = {
    position: 'absolute',
    width: '98%',
    left: '1%',
    top: 70,
}

const BRANCH_STYLE = {
    ...CONTENT_STYLE,
    display: 'grid',
    gridGap: 5,
    gridTemplateColumns: '33% 33% 33%',
};

const BRANCH_ITEM_STYLE = {
        display: 'grid',
        placeItems: 'center',
        backgroundColor: Colors.navItems,
        color: Colors.textColor,
        border: '1px solid ' + Colors.textColor,
        height: 100,
        // ...getGridIndex(idx, NUM_CONTENT_COLS)
};

const NavigationBar = ({setPath, previous, current}) => (
    <div style={NAVIGATION_STYLE}>
        {previous.map(
            ({label, location}, index) => (
                <div key={`${label}-${index}`}
                     onClick={() => setPath(location)}
                     style={NAVIGATION_ITEM_STYLE}
                >
                    <label>{label}</label>
                </div>
            )
        )}
        <div style={NAVIGATION_ITEM_STYLE}>
            <label>{current}</label>
        </div>
    </div>
)

const parseBranch = (setPath, {type, label, ...node}, path, navigation, index, props) => {
    if (index < path.length) {
        if (type !== 'branch') {
            return () => <div>Descended past a leaf</div>;
        }
        return parseBranch(
            setPath,
            node.children[path[index]],
            path,
            [...navigation, {label, location: path.slice(0, index)}],
            index + 1,
            props);
    }
    if (type === 'leaf') {
        return () => (
            <>
                <NavigationBar previous={navigation} current={label} setPath={setPath}/>
                <div style={CONTENT_STYLE}>
                    <node.component {...props}/>
                </div>
            </>
        );
    }
    if (type !== 'branch') {
        return () => <div>Unknown node type.</div>
    }
    return () => (
        <>
            <NavigationBar previous={navigation} current={label} setPath={setPath}/>
            <div style={BRANCH_STYLE}>
                {node.children.map(
                    ({label}, index) => (
                        <div
                            key={label}
                            style={BRANCH_ITEM_STYLE}
                            onClick={() => setPath([...path, index])}
                        >
                            <label>{label}</label>
                        </div>
                    )
                )}
            </div>
        </>
    );
}

const ComponentTree = ({tree, ...props}) => {
    const [path, setPath] = useState([]);
    const Component = parseBranch(setPath, tree, path,[], 0, props);
    return <Component/>
};

export default ComponentTree;

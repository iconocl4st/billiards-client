import React, {useState} from 'react';
import {NAVIGATION_STYLE, PRIMARY_STYLE, navGridStyle, compGridStyle} from "./styles";

const NUM_NAVIGATION_COLS = 5;

const NavigationBar = ({setPath, previous, current}) => (
    <>
        {previous.map(
            ({label, location}, index) => (
                <div style={navGridStyle(index)}>
                    <button key={label} onClick={() => setPath(location)}>
                        {label}
                    </button>
                </div>
            )
        )}
        <div style={navGridStyle(previous.length)}>
            <label>{current}</label>
        </div>
    </>
)

const parseBranch = (setPath, {type, label, ...node}, path, navigation, index) => {
    if (index < path.length) {
        if (type !== 'branch') {
            return () => <div>Descended past a leaf</div>;
        }
        return parseBranch(
            setPath,
            node.children[path[index]],
            path,
            [...navigation, {label, location: path.slice(0, index)}],
            index + 1);
    }
    if (type === 'leaf') {
        return () => (
            <>
                <div style={NAVIGATION_STYLE}>
                    <NavigationBar previous={navigation} current={label} setPath={setPath}/>
                </div>
                <div style={PRIMARY_STYLE}>
                    <node.component/>
                </div>
            </>
        );
    }
    if (type !== 'branch') {
        return () => <div>Unknown node type.</div>
    }
    return () => (
        <>
            <div style={NAVIGATION_STYLE}>
                <NavigationBar previous={navigation} current={label} setPath={setPath}/>
            </div>
            <div style={PRIMARY_STYLE}>
                {node.children.map(
                    ({label}, index) => (
                        <div style={compGridStyle(index)}>
                            <button key={label} onClick={() => setPath([...path, index])}>
                                {label}
                            </button>
                        </div>
                    )
                )}
            </div>
        </>
    );
}

const ComponentTree = ({tree}) => {
    const [path, setPath] = useState([]);
    const Component = parseBranch(setPath, tree, path,[], 0);
    return <Component/>
};

export default ComponentTree;

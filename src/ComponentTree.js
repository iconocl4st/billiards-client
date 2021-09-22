import React, { useState } from 'react';

const NavigationBar = ({setPath, previous, current}) => (
    <>
        {previous.map(
            ({label, location}) => <button onClick={() => setPath(location)}>{label}</button>
        )}
        <label>{current}</label>
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
                <NavigationBar previous={navigation} current={label} setPath={setPath}/>
                <br/>
                <node.component/>
            </>
        );
    }
    if (type !== 'branch') {
        return () => <div>Unknown node type.</div>
    }
    return () => (
        <>
            <NavigationBar previous={navigation} current={label} setPath={setPath}/>
            <br/>
            <div>
                {node.children.map(
                    ({label}, index) => (
                        <button key={label} onClick={() => setPath([...path, index])}>{label}</button>
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

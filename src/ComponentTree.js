import React, {useState} from 'react';
import {NAVIGATION_STYLE, compGridStyle, COLORS_ARRAY, CONTENT_STYLE} from "./styles";

const NAV_ITEM_WIDTH = 20;

const NAV_ITEM_STYLE = {
    position: 'absolute',
    display: 'grid',
    placeItems: 'center',
    backgroundColor: COLORS_ARRAY[4],
    color: COLORS_ARRAY[1],
    width: (NAV_ITEM_WIDTH - 1) + '%',
    border: '1px solid white'
};

const NavigationBar = ({setPath, previous, current}) => (
    <div style={NAVIGATION_STYLE}>
        {previous.map(
            ({label, location}, index) => (
                <div key={`${label}-${index}`}
                     onClick={() => setPath(location)}
                     style={{
                         ...NAV_ITEM_STYLE,
                         left: (index * NAV_ITEM_WIDTH) + '%',
                     }}
                >
                    <label>{label}</label>
                </div>
            )
        )}
        <div style={{
            ...NAV_ITEM_STYLE,
            left: (NAV_ITEM_WIDTH * previous.length) + '%'
        }}>
            <label>{current}</label>
        </div>
    </div>
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
                <div style={CONTENT_STYLE}>
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
            <NavigationBar previous={navigation} current={label} setPath={setPath}/>
            <div style={CONTENT_STYLE}>
                {node.children.map(
                    ({label}, index) => (
                        <div key={label} style={compGridStyle(index)} onClick={() => setPath([...path, index])}>
                            <label>{label}</label>
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

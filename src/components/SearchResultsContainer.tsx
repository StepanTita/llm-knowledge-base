import styles from "@/styles/Home.module.css";
import {round} from "@xenova/transformers";

type ResultsProps = {
    list: { request?: string, response?: string, score?: number, topic?: string }[],
    context: string[],
    onContextUpdate: (newContext: string[]) => void,

    disabled: boolean[],
    setDisabled: React.Dispatch<React.SetStateAction<boolean[]>>
}


function formatTopic(s: string) {
    s = s.replaceAll('_', ' ');
    return s.charAt(0).toUpperCase() + s.slice(1);
}

function SearchResultsContainer(props: ResultsProps) {
    const cards = [];


    for (let i in props.list) {
        cards.push(
            <span
                key={i}
                className={styles.card + (props.disabled[i] ? ' ' + styles.disabled : '')}
                onClick={() => {
                    if (!props.disabled[i])
                        props.onContextUpdate([...props.context, props.list[i].response || '']);
                    props.disabled[i] = true;
                    props.setDisabled([...props.disabled]);
                }}
            >
                {/*'rgba(0, 0, 0, ' + ((props.list[i].score || 0) / scoreSum) + ')'*/}
                <h2>
                    {formatTopic(props.list[i].topic || 'Complaints')} <span className={styles.badge + ' ' + styles.badgePrimary}>{round(props.list[i].score || 0, 3)}</span> <span>-&gt;</span>
                </h2>
                <p>
                    {props.list[i].request}
                </p>
                <hr/>
                    <p>
                    {props.list[i].response}
                </p>
            </span>
        );
    }

    return (
        <>
            <div className={styles.grid}>
                {cards}
            </div>
        </>
    );
}

export default SearchResultsContainer
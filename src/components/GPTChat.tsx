import styles from "@/styles/Home.module.css";
import generateReplyGPT from "@/src/openaiConnector.ts";
import {useEffect, useRef, useState} from "react";

type GPTProps = {
    query: string,
    context: string[]
}

function GPTChat(props: GPTProps) {
    const [replyGPT, setReplyGPT] = useState<string>('');

    const replyRef = useRef<string>();

    useEffect(() => {
        replyRef.current = replyGPT;
    }, [replyGPT])

    const onChatSubmit = async () => {
        setReplyGPT('');

        const stream = generateReplyGPT(props.context.join('\n'), props.query);

        stream.on('content', (delta, snapshot) => {
            replyRef.current += delta;
            setReplyGPT(replyRef.current || '');
        });
    }

    return (
        <>
            <section>
                <div className={styles.fakeMenu}>
                    <div className={styles.fakeButtons + ' ' + styles.fakeClose}></div>
                    <div className={styles.fakeButtons + ' ' + styles.fakeMinimize}></div>
                    <div className={styles.fakeButtons + ' ' + styles.fakeZoom}></div>
                </div>
                <div className={styles.textAlignL + ' ' + styles.terminal} onClick={onChatSubmit}>
                    <blockquote className={styles.chatContext}>
                        <b className={styles.contextPrompt}>Context</b>:
                        <div className={styles.contextText}>
                            <em className={styles.contextPrompt}>
                                {props.context.join('\n')}
                            </em>
                        </div>
                    </blockquote>

                    <h4 className='terminal-prompt'>$ <span className={styles.userInput}>{props.query}</span></h4>

                    <blockquote className={styles.chatReply}>
                        <b className={styles.reply}>Reply</b>:
                        <div className={styles.replyText}>
                            <em className={styles.reply}>
                                {replyGPT}
                            </em>
                        </div>
                    </blockquote>
                </div>
            </section>
        </>
    )
}

export default GPTChat;
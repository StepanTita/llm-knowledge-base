import Head from 'next/head'
import {Inter} from 'next/font/google'
import styles from '@/styles/Home.module.css'
import SearchResultsContainer from "@/src/components/SearchResultsContainer";
import GPTChat from "@/src/components/GPTChat";
import {query} from "@/src/query.ts";
import {useState} from "react";

const inter = Inter({subsets: ['latin']})

const contextLen = 8;

export default function Home() {

    const [search, setSearch] = useState('');
    const [contextResults, setContextResults] = useState<{ text?: string, score?: number }[]>([]);
    const [context, setContext] = useState<string[]>([]);

    const [disabled, setDisabled] = useState<Array<boolean>>(new Array(contextLen));

    const onSearch = async (e: any) => {
        e.preventDefault();
        e.stopPropagation();

        setDisabled(new Array(contextLen));
        setContext([]);
        setContextResults(await query(search, contextLen) || []);
    };

    return (
        <>
            <Head>
                <title>LLM Knowledge Base</title>
                <meta name="description" content="Generated by create next app"/>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <main className={`${styles.main} ${inter.className}`}>
                <div className={styles.center}>
                    <h1>LLM Knowledge Base</h1>
                </div>

                <div className={styles.center}>
                    <div className={styles.container}>
                        <form onSubmit={onSearch}>
                            <input type="text" placeholder="Search..." name='search' value={search}
                                   onChange={(e: any) => setSearch(e.target.value)}/>
                            <div className={styles.search}></div>
                        </form>
                    </div>
                </div>

                <GPTChat query={search} context={context}></GPTChat>

                <hr/>

                <SearchResultsContainer
                    disabled={disabled}
                    setDisabled={setDisabled}
                    list={contextResults}
                    context={context}
                    onContextUpdate={(newContext: string[]) => setContext(newContext)}>
                </SearchResultsContainer>
            </main>
        </>
    )
}

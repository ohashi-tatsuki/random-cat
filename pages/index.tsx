import {GetServerSideProps, NextPage} from "next";
import { useEffect, useState } from "react";
import styles from "./index.module.css";

type Props = {
    initialImageUrl: string;
};

const IndexPage: NextPage<Props> = ({initialImageUrl}) => {
    const [imageUrl, setImageUrl] = useState(initialImageUrl);
    const [loading, setLoading] = useState(true);

    // マウント時に画像を読み込む宣言
    // useEffect(処理内容, タイミング)
    // タイミングが空の配列の場合は"コンポーネントがマウントされた時"に実行する
    useEffect(() => {
        fetchImage().then((newImage) => {
            setImageUrl(newImage.url);
            setLoading(false);
        });
    },[]);

    // ボタンを押した時に画像を読み込む処理
    const handleClick = async () => {
        setLoading(true); // 読み込み中フラグを立てる
        const newImage = await fetchImage();
        setImageUrl(newImage.url); // 画像URLの状態を更新する
        setLoading(false);  // 読み込みフラグを倒す
    }

    // ローディング中でなければ、画像を表示する
    // || は 論理和演算子, 左辺がfalseの場合、右辺を実行する
    // loading = false なら画像を表示する(短絡評価)
    return(
        <div className={styles.page}>
            <button onClick={handleClick} className={styles.button}>他のニャンコも見るニャ!</button>
            <div className={styles.frame}>
                {loading || <img src={imageUrl} className={styles.img}/>}
            </div>
        </div>
    );
};

export default IndexPage;

// サーバーサイドで実行する処理
export const getServerSideProps: GetServerSideProps<Props> =async () => {
    const image = await fetchImage();
    return {
        props: {
            initialImageUrl: image.url,
        },
    };
};

// 型定義
// 画像以外に必要な物があったら追加で定義すれば良い
type Image = {
    url: string;
};

// fetch: HTTPリクエストでリソースを取得する
const fetchImage = async (): Promise<Image> => {
    const res = await fetch("https://api.thecatapi.com/v1/images/search");
    const images = await res.json();
    console.log(images);
    return images[0];
};

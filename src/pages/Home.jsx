import { useState, useRef } from 'react';
import './Home.css';
import { collection, addDoc, orderBy, query, limit, serverTimestamp } from 'firebase/firestore';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { auth, db } from '../firebase';

const fallbackAvatar = (name) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'Guest')}&background=0f172a&color=fff`;

const defaultRecentEmojis = ['😂', '🔥', '😍', '😭', '🥳', '😎', '❤️', '🤩'];

const emojiGroups = [
  {
    title: 'Smileys & people',
    emojis: ['😀', '😁', '😂', '🤣', '😊', '😍', '😘', '🤩', '😎', '🤔', '😴', '🥳', '😡', '🤯', '😭']
  },
  {
    title: 'Gestures',
    emojis: ['👍', '👎', '👏', '🙌', '🙏', '🤝', '👌', '🤌', '🤟', '✌️', '🤙', '🤞']
  },
  {
    title: 'Animals & nature',
    emojis: ['🐶', '🐱', '🦊', '🐼', '🐻', '🦄', '🐸', '🐧', '🦋', '🌸', '🌿', '🔥', '🌈']
  },
  {
    title: 'Food & drink',
    emojis: ['🍕', '🍔', '🍣', '🍪', '🍩', '🍰', '🍓', '🍉', '🍇', '🍿', '☕', '🥤']
  },
  {
    title: 'Activities',
    emojis: ['⚽', '🏀', '🎮', '🎧', '🎲', '🎬', '🎨', '🎤', '🎉', '🎁', '🏆']
  }
];

function Home() {
  const messagesRef = collection(db, 'messages');
  const messagesQuery = query(messagesRef, orderBy('createdAt'), limit(100));
  const [messages] = useCollectionData(messagesQuery, { idField: 'id' });
  const [text, setText] = useState('');
  const [showEmojis, setShowEmojis] = useState(false);
  const [emojiTab, setEmojiTab] = useState('emoji');
  const [emojiSearch, setEmojiSearch] = useState('');
  const [recentEmojis, setRecentEmojis] = useState(defaultRecentEmojis);
  const endRef = useRef(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!text.trim()) return;
    const { uid, photoURL, displayName } = auth.currentUser;
    await addDoc(messagesRef, {
      text,
      createdAt: serverTimestamp(),
      uid,
      photoURL: photoURL || '',
      displayName: displayName || ''
    });
    setText('');
    setShowEmojis(false);
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleEmoji = (emojiChar) => {
    if (!emojiChar) return;
    setText((prev) => prev + emojiChar);
    setRecentEmojis((prev) => {
      const next = [emojiChar, ...prev.filter((emoji) => emoji !== emojiChar)];
      return next.slice(0, 16);
    });
  };

  return (
    <div className="home-page">
      <div className="messages-panel">
        {messages?.map((message) => (
          <ChatMessage key={message.id} data={message} />
        ))}
        <span ref={endRef} />
      </div>
      <form className="chat-form" onSubmit={handleSubmit}>
        <input
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Type a message"
        />
        <button
          type="button"
          className="emoji-toggle icon-button"
          aria-label="Choose emoji"
          onClick={() => setShowEmojis((prev) => !prev)}
        >
          <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
            <path
              d="M12 2a10 10 0 1 0 .001 20.001A10 10 0 0 0 12 2Zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16Zm3.5-6.25a.75.75 0 0 1 .75.75c0 .621-.308 1.3-.856 1.873C14.782 17 13.45 17.5 12 17.5s-2.782-.5-3.394-1.127A2.73 2.73 0 0 1 7.75 14.5a.75.75 0 0 1 1.5 0c0 .165.074.42.327.682C10 15.52 10.863 16 12 16s2-.48 2.423-.818c.253-.262.327-.517.327-.682a.75.75 0 0 1 .75-.75Zm-6.25-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm7.5 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"
              fill="currentColor"
            />
          </svg>
        </button>
        <button className="icon-button send-button" type="submit" disabled={!text.trim()}>
          <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
            <path d="M2 21l21-9L2 3v7l15 2-15 2z" />
          </svg>
        </button>
      </form>
      {showEmojis && (
        <div className="emoji-panel">
          <div className="emoji-tabs">
            {['emoji', 'gifs', 'stickers'].map((tab) => (
              <button
                key={tab}
                className={`emoji-tab ${emojiTab === tab ? 'active' : ''}`}
                onClick={() => setEmojiTab(tab)}
              >
                {tab === 'emoji' && 'Emoji'}
                {tab === 'gifs' && 'GIFs'}
                {tab === 'stickers' && 'Stickers'}
              </button>
            ))}
          </div>
          <div className="emoji-search">
            {emojiTab === 'emoji' && (
              <input
                type="text"
                placeholder="Search emojis"
                value={emojiSearch}
                onChange={(event) => setEmojiSearch(event.target.value)}
              />
            )}
          </div>
          {emojiTab !== 'emoji' ? (
            <div className="emoji-placeholder">
              {emojiTab === 'gifs' ? 'GIF picker coming soon.' : 'Sticker picker coming soon.'}
            </div>
          ) : (
            <div className="emoji-scroll">
              {recentEmojis.length > 0 && (
                <EmojiSection title="Recent" emojis={recentEmojis} onEmojiClick={handleEmoji} />
              )}
              {emojiGroups.map((group) => (
                <EmojiSection
                  key={group.title}
                  title={group.title}
                  emojis={group.emojis.filter((emoji) =>
                    emoji.toLowerCase().includes(emojiSearch.toLowerCase())
                  )}
                  onEmojiClick={handleEmoji}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ChatMessage({ data }) {
  const isOwner = data.uid === auth.currentUser?.uid;
  const name = data.displayName || 'Guest';
  const avatar = data.photoURL || fallbackAvatar(name);
  return (
    <div className={`chat-message ${isOwner ? 'own' : ''}`}>
      <div className="message-avatar">
        <img src={avatar} alt={`${name} avatar`} />
      </div>
      <div className="message-body">
        <span className="sender-name">{name}</span>
        <p>{data.text}</p>
      </div>
    </div>
  );
}

export default Home;

function EmojiSection({ title, emojis, onEmojiClick }) {
  if (!emojis.length) {
    return null;
  }
  return (
    <div className="emoji-section">
      <p className="emoji-section-title">{title}</p>
      <div className="emoji-grid">
        {emojis.map((emoji) => (
          <button key={emoji} type="button" onClick={() => onEmojiClick(emoji)}>
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
}


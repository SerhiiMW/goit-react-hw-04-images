import { useState, useEffect, useRef } from 'react';
import styles from './searchbar.module.css';

import Button from '../Button/Button';
import Modal from '../Modal/Modal';
import ImageGallery from 'components/ImageGallery/ImageGallery';
import { RotatingLines } from 'react-loader-spinner';

import { searchImg } from '../../api/image';

const ImgSearchForm = ({ onSubmit }) => {
  const [state, setState] = useState({
    search: '',
  });
  const inputRef = useRef(null);
  useEffect(() => {
    inputRef.current.focus();
  }, []);
  const handleChange = ({ target }) => {
    const { name, value } = target;
    setState({
      ...state,
      [name]: value,
    });
  };
  const handleSubmit = e => {
    e.preventDefault();
    onSubmit({ ...state });
    reset();
  };
  const reset = () => {
    setState({
      search: '',
    });
  };
  return (
    <header className={styles.Searchbar}>
      <form onSubmit={handleSubmit} className={styles.SearchForm}>
        <button type="submit" className={styles.SearchFormButton}>
          <span className={styles.SearchFormButtonLabel}>&#128269;</span>
        </button>
        <input
          ref={inputRef}
          value={state.search}
          onChange={handleChange}
          required
          className={styles.SearchFormInput}
          type="text"
          name="search"
          placeholder="Search images and photos"
        />
      </form>
    </header>
  );
};

const ImgSearch = () => {
  const [search, setSearch] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [largeImg, setLargeImg] = useState('');
  const [totalHits, setTotalHits] = useState(0)
  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        const { data } = await searchImg(search, page);
        setImages(prevImages =>
          data.hits?.length ? [...prevImages, ...data.hits] : prevImages
        );
        setTotalHits(totalHits => (data.totalHits));
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (search) {
      fetchImages();
    }
  }, [search, page]);
  const handleSearch = ({ search }) => {
    setSearch(search);
    setImages([]);
    setPage(1);
  };
  const loadMore = () => setPage(prevPage => prevPage + 1);
  const showModal = ({ largeImageURL }) => {
    setModalOpen(true);
    setLargeImg(largeImageURL);
  };
  const closeModal = () => {
    setModalOpen(false);
    setLargeImg('');
  };
  const isImages = Boolean(images.length);
  const loadMoreBtn = page < Math.ceil(totalHits / 12);
  return (
    <>
      <ImgSearchForm onSubmit={handleSearch} />
      {error && <p className={styles.error}>{error}</p>}
      {loading && <RotatingLines />}
      {isImages && <ImageGallery showModal={showModal} items={images} />}
      {isImages && loadMoreBtn && (
        <div className={styles.loadMoreWrapper}>
          <Button onClick={loadMore} type="button">
            Load more
          </Button>
        </div>
      )}
      {modalOpen && (
        <Modal close={closeModal}>
          <img className={styles.modalImg} src={largeImg} alt="" />
        </Modal>
      )}
    </>
  );
};

export default ImgSearch;

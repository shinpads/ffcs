import React, { useState } from 'react';
import { createUseStyles } from 'react-jss';
import { connect } from 'react-redux';
import Header from '../Header';
import Spinner from '../Spinner';

const styles = createUseStyles({
  container: {
    maxWidth: '1000px',
    margin: '0 auto',
    paddingTop: '6rem',
  },
  formContainer: {
    maxWidth: '900px',
    margin: '0 auto',
    paddingTop: '5rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingBottom: '2rem',
  },
  question: {
    fontSize: '22px',
    marginTop: '2rem',
    marginBottom: '0.5rem',
    textAlign: 'center',
  },
  content: {
    display: 'grid',
    gridTemplateColumns: '4fr 8fr',
    gridGap: '1rem',
  },
});

const UserManage = (props) => {
  const classes = styles();
  const [loading, setLoading] = useState(false);

  const { match, user: userObject } = props;
  const { loaded: userLoaded, user } = userObject;
  const { params } = match;
  const { id } = params;

  const submit = () => {

  };

  const formChange = () => {

  };

  if (loading || !userLoaded) {
    return (
      <>
        <Header />
        <div className={classes.container}>
          <Spinner />
        </div>
      </>
    );
  }

  if (user.id !== parseInt(id, 10)) {
    return (
      <>
        <Header />
        <div className={classes.content}>You do not have permission to view this page!</div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className={classes.formContainer}>
        <form className={classes.form} onSubmit={submit} onChange={formChange}>
          <div className={classes.question}>Change role preferences</div>
        </form>
      </div>
    </>
  );
};

function mapStateToProps(state) {
  return {
    user: state.user,
  };
}

export default connect(mapStateToProps)(UserManage);

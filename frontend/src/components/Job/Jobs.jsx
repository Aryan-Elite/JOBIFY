import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../../main";
import styles from "./Jobs.module.css";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const { isAuthorized } = useContext(Context);
  const navigateTo = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:4000/api/v1/job/getall", {
        withCredentials: true,
      })
      .then((res) => {
        setJobs(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  if (!isAuthorized) {
    navigateTo("/");
  }

  return (
    <div className={styles.heade}>
    <section className={styles.jobs}>
      <div className={styles.container}>
        <h1>ALL  AVAILABLE  JOBS</h1>
        <div className={styles.banner}>
          {jobs.jobs &&
            jobs.jobs.map((element) => (
              <div className={styles.card} key={element._id}>
                <p className={styles.title}>{element.title}</p>
                <p className={styles.category}>{element.category}</p>
                <p>{element.country}</p>
                <Link to={`/job/${element._id}`}>Job Details</Link>
              </div>
            ))}
        </div>
      </div>
    </section>
    </div>
  );
};

export default Jobs;


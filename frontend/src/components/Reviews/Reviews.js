import React, {
  useEffect,
  useState
} from "react";

import {
  Link
} from "react-router-dom";

import {
  FaArrowLeft,
  FaCode,
  FaEye,
  FaSearch,
  FaClock
} from "react-icons/fa";

import {
  getReviews
} from "../../services/api";

import "./Reviews.css";


function Reviews() {

  const [reviews, setReviews] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [selectedReview, setSelectedReview] =
    useState(null);



  useEffect(() => {

    loadReviews();

  }, []);



  const loadReviews = async () => {

    try {

      setLoading(true);

      setError("");


      const data =
        await getReviews();


      setReviews(data);

    }

    catch (error) {

      console.error(
        "Failed to load reviews:",
        error
      );


      setError(
        "Could not load review history."
      );

    }

    finally {

      setLoading(false);

    }

  };



  const filteredReviews =
    reviews.filter((review) => {

      return review.filename
        ?.toLowerCase()
        .includes(
          search.toLowerCase()
        );

    });



  const getScoreClass = (score) => {

    if (score >= 80)
      return "score-good";

    if (score >= 60)
      return "score-medium";

    return "score-low";

  };



  const parseAnalysis = (analysis) => {

    if (!analysis)
      return [];


    if (Array.isArray(analysis))
      return analysis;


    try {

      return JSON.parse(
        analysis
      );

    }

    catch {

      return [];

    }

  };



  return (

    <div className="reviews-page">


      <div className="reviews-header">


        <div>

          <Link
            to="/"
            className="back-button"
          >

            <FaArrowLeft />

            Dashboard

          </Link>


          <h1>
            Review History
          </h1>


          <p>
            View your previous AI code reviews
          </p>

        </div>


        <div className="review-count">

          <FaCode />

          <div>

            <span>
              Total Reviews
            </span>

            <strong>
              {reviews.length}
            </strong>

          </div>

        </div>


      </div>



      <div className="search-container">

        <FaSearch />

        <input
          type="text"
          placeholder="Search reviews by filename..."
          value={search}
          onChange={(event) =>
            setSearch(
              event.target.value
            )
          }
        />

      </div>



      {
        loading && (

          <div className="reviews-message">

            Loading review history...

          </div>

        )
      }



      {
        error && (

          <div className="reviews-error">

            {error}

          </div>

        )
      }



      {
        !loading &&
        !error &&
        filteredReviews.length === 0 && (

          <div className="empty-reviews">

            <FaCode />

            <h2>
              No reviews found
            </h2>

            <p>
              Analyze a code file from the dashboard
              and it will appear here.
            </p>

          </div>

        )
      }



      {
        !loading &&
        !error && (

          <div className="reviews-grid">


            {
              filteredReviews.map(
                (review) => (

                  <div
                    className="history-card"
                    key={review.id}
                  >


                    <div className="history-card-top">


                      <div className="file-icon">

                        <FaCode />

                      </div>


                      <div className="file-details">

                        <h3>
                          {review.filename}
                        </h3>

                        <p>

                          <FaClock />

                          {
                            review.created_at
                              ? new Date(
                                  review.created_at
                                ).toLocaleString()
                              : "Unknown date"
                          }

                        </p>

                      </div>


                    </div>



                    <div className="history-info">


                      <div>

                        <span>
                          Quality Score
                        </span>


                        <strong
                          className={
                            getScoreClass(
                              review.quality_score
                            )
                          }
                        >

                          {
                            review.quality_score ??
                            "N/A"
                          }

                        </strong>

                      </div>



                      <div>

                        <span>
                          Issues
                        </span>

                        <strong>

                          {
                            parseAnalysis(
                              review.analysis
                            ).length
                          }

                        </strong>

                      </div>


                    </div>



                    <button
                      className="view-review-button"
                      onClick={() =>
                        setSelectedReview(
                          review
                        )
                      }
                    >

                      <FaEye />

                      View Review

                    </button>


                  </div>

                )
              )
            }


          </div>

        )
      }



      {
        selectedReview && (

          <div
            className="review-modal-overlay"
            onClick={() =>
              setSelectedReview(null)
            }
          >


            <div
              className="review-modal"
              onClick={(event) =>
                event.stopPropagation()
              }
            >


              <div className="modal-header">

                <div>

                  <h2>
                    {
                      selectedReview.filename
                    }
                  </h2>

                  <p>
                    Previous AI code review
                  </p>

                </div>


                <button
                  className="close-modal"
                  onClick={() =>
                    setSelectedReview(null)
                  }
                >

                  ×

                </button>

              </div>



              <div className="modal-score">

                <span>
                  Quality Score
                </span>

                <strong>

                  {
                    selectedReview.quality_score
                  }

                </strong>

              </div>



              <div className="modal-section">

                <h3>
                  AI Findings
                </h3>


                {
                  parseAnalysis(
                    selectedReview.analysis
                  ).length === 0
                  ? (

                    <p className="no-findings">
                      No AI findings stored.
                    </p>

                  )
                  : (

                    parseAnalysis(
                      selectedReview.analysis
                    ).map(
                      (issue, index) => (

                        <div
                          key={index}
                          className={`modal-issue ${
                            issue.severity
                              ?.toLowerCase() ||
                            "medium"
                          }`}
                        >

                          <div className="modal-issue-header">

                            <strong>
                              {
                                issue.title ||
                                "Code Issue"
                              }
                            </strong>

                            <span>
                              {
                                issue.severity ||
                                "MEDIUM"
                              }
                            </span>

                          </div>


                          <p>
                            {
                              issue.message ||
                              "No description available."
                            }
                          </p>

                        </div>

                      )
                    )

                  )
                }


              </div>



              <div className="modal-section">

                <h3>
                  Source Code
                </h3>


                <pre className="review-code">

                  {
                    selectedReview.code
                  }

                </pre>

              </div>


            </div>


          </div>

        )
      }


    </div>

  );

}


export default Reviews;
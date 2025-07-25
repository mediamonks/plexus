gcloud services enable aiplatform.googleapis.com --project monks-plexus
gcloud services enable apigateway.googleapis.com --project monks-plexus
gcloud services enable cloudbuild.googleapis.com --project monks-plexus
gcloud services enable cloudfunctions.googleapis.com --project monks-plexus
#gcloud services enable cloudtasks.googleapis.com --project monks-plexus
#gcloud services enable discoveryengine.googleapis.com --project monks-plexus
gcloud services enable drive.googleapis.com --project monks-plexus
gcloud services enable docs.googleapis.com --project monks-plexus
gcloud services enable firestore.googleapis.com --project monks-plexus
gcloud services enable run.googleapis.com --project monks-plexus
gcloud services enable secretmanager.googleapis.com --project monks-plexus
gcloud services enable servicecontrol.googleapis.com --project monks-plexus
gcloud services enable sheets.googleapis.com --project monks-plexus
gcloud services enable storage.googleapis.com --project monks-plexus
gcloud storage buckets create gs://monks-plexus --location=europe-west1 --project monks-plexus
gcloud firestore databases create --database=plexus --location=europe-west1 --type=firestore-native --project=monks-plexus
PROJECT_NUMBER=$(gcloud projects describe monks-plexus --format='value(projectNumber)' --quiet)
gcloud projects add-iam-policy-binding monks-plexus --member=serviceAccount:$PROJECT_NUMBER-compute@developer.gserviceaccount.com --role=roles/cloudbuild.builds.builder
gcloud iam service-accounts create plexus --display-name="plexus" --project monks-plexus
gcloud projects add-iam-policy-binding monks-plexus --member="serviceAccount:plexus@monks-plexus.iam.gserviceaccount.com" --role="roles/cloudfunctions.invoker"
gcloud projects add-iam-policy-binding monks-plexus --member="serviceAccount:plexus@monks-plexus.iam.gserviceaccount.com" --role="roles/run.invoker"
gcloud projects add-iam-policy-binding monks-plexus --member="serviceAccount:plexus@monks-plexus.iam.gserviceaccount.com" --role="roles/aiplatform.user"
gcloud projects add-iam-policy-binding monks-plexus --member="serviceAccount:plexus@monks-plexus.iam.gserviceaccount.com" --role="roles/storage.admin"
gcloud projects add-iam-policy-binding monks-plexus --member="serviceAccount:plexus@monks-plexus.iam.gserviceaccount.com" --role="roles/datastore.user"
gcloud projects add-iam-policy-binding monks-plexus --member="serviceAccount:plexus@monks-plexus.iam.gserviceaccount.com" --role="roles/drive.file"

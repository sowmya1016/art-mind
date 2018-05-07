def featmat(obj, pref) : 
    feat = pd.read_csv("features_collapsedstyles.csv", encoding='latin-1')
    feat.drop(["Unnamed: 0", "Unnamed: 0.1", "Title", "Artist", "Dated", "Geography", "Medium", "Movement", "Period"], 
              axis = 1, inplace = True)
    feat = pd.get_dummies(feat, columns = ["Classification", "Style"]) 
    
    #reindex according to ObjectID
    df = feat.set_index("ObjectID")
    
    #feature_matrix will contain only the ten rows corresponding to the art shown to the user
    feature_matrix = df.loc[obj]
    
    #multiply corresponding entries in feature_matrix by -1 for the artworks which the user indicated thumbs down.
    for i in range(len(pref)) : 
        feature_matrix.loc[i] = pref[i] * feature_matrix.iloc[i] 
    feature_matrix.drop(range(10), axis = 0, inplace = True) 
    
    #for each column, find the mean
    feature_means = feature_matrix.mean(axis = 0) 
    
    #now, compare user_prefs with feature_means by taking manhattan norm
    norms = []
    for ind in df.index : 
        norms.append({"index":ind, "norm":np.linalg.norm(np.array(df.loc[ind])-np.array(feature_means) )})
    norms_df = pd.DataFrame(norms)
    norms_df.sort_values("norm", axis =0, inplace = True)
    
    #finally, normalize the norms so that they are between 0 and 1, and then sort in descending order
    normalized = [1-1/(1+np.exp(-norms_df.norm.iloc[i])) for i in range(len(norms_df))]
    norms_df["normalized"] = normalized 
    norms_df.sort_values("normalized", axis = 0, ascending = False, inplace = True) 
    
    #can change this to return the first best match, the top 3 best matches, etc
    return(norms_df) 
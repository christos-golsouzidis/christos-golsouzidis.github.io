import{t as y,a as w}from"../chunks/DdLVzA7k.js";import"../chunks/D2xVqN_Y.js";import{A as s,B as f,y as a,z as n,C as b,n as v}from"../chunks/Bbw9Kdul.js";import{e as x,i as S,C as T}from"../chunks/CHx5ygDG.js";import{h as e,I as E}from"../chunks/Dh3kU1fa.js";/* empty css                */var I=y('<h2>1. Description</h2> <h3>1.1 Project</h3> <p>This data engineering project is the development of an ELT pipeline regarding rental data in Berlin.</p> <h3>1.2 Process</h3> <p>The pipeline extracts data from external sources. Here, the data are provided by the fictional company ACME through its API, and through transformations we will generate dashboards for getting some insights. The pipeline is fully automated leveraging an orchestration flow through sceduling tasks.</p> <h2>2. Architecture</h2> <p><img src="/berlin_rental_analytics/elt_pipeline.png" alt="elt_pipeline"></p> <h2>3. Technical details</h2> <h3>3.1 Technologies</h3> <table><thead><tr><th>Component</th><th>Technology</th><th>Purpose</th></tr></thead><tbody><tr><td><strong>Orchestration</strong></td><td>Prefect</td><td>Workflow management</td></tr><tr><td><strong>Data Validation</strong></td><td>JSON Schema</td><td>Type safety</td></tr><tr><td><strong>Data Processing</strong></td><td>Polars</td><td>High-performance DataFrame operations</td></tr><tr><td><strong>Storage</strong></td><td>Parquet + DuckDB</td><td>Columnar storage & analytics</td></tr><tr><td><strong>Transformation</strong></td><td>dbt</td><td>SQL-based modeling</td></tr><tr><td><strong>Visualization</strong></td><td>Streamlit + Plotly</td><td>Interactive dashboards</td></tr></tbody></table> <h3>3.2 Medallion data architecture</h3> <p>(Bronze -> Silver -> Gold)</p> <table><thead><tr><th>Bronze</th><th>Silver</th><th>Gold</th></tr></thead><tbody><tr><td>json</td><td>parquet</td><td>DuckDB</td></tr><tr><td>raw, immutable data</td><td>cleaned data</td><td>aggregated</td></tr></tbody></table> <h4>3.2.1 Bronze Layer (Json)</h4> <ul><li>raw immutable data</li> <li>saved as extracted to <code>bronze/</code> with no transformations involved preverving original data</li></ul> <p>The code in <code>elt_bronze.py</code>:</p> <pre class="language-python"><!></pre> <h4>3.2.2 Silver Layer (Parquet)</h4> <ul><li>Hive partition schema for applying to any data architecture</li> <li>Parquet files save less space and can speed up the process of analytics</li> <li>Partition per day</li> <li>Column pruning</li> <li>Data deduplication</li></ul> <p>The code in <code>elt_silver.py</code>:</p> <pre class="language-python"><!></pre> <h4>3.2.3 Gold Layer (DuckDB)</h4> <ul><li><code>rent_trend</code>: Quarterly average warm rent</li> <li><code>nb_rent_ranking</code>: Neighborhoods ranked by rent</li> <li><code>nb_listings</code>: Property count per neighborhood</li> <li><code>furnished_impact</code>: Rent comparison by furnishing</li> <li><code>furnished_percentage</code>: Market share distribution</li></ul> <p>The code in <code>elt_gold.py</code>:</p> <pre class="language-python"><!></pre> <p>Here is a query for getting the neighborhood rent rankings:</p> <pre class="language-sql"><!></pre> <h3>3.3 Orchestration</h3> <p>The entire ELT process is orchestrated. Some features include:</p> <ul><li>Task dependency management</li> <li>Error handling and retries</li> <li>Scheduled execution (cron-based)</li> <li>Docker container support</li></ul> <p>The pipeline:</p> <pre class="language-python"><!></pre> <p>The end result: data visualization depicted on dashboards on the web leveraging streamlit:</p> <pre class="language-python"><!></pre> <h2>4. Future additions</h2> <ul><li>Addition of unit tests</li> <li>Implementation of rerunning the pipeline on failure with exponential decay</li> <li>Development of messaging about the pipeline status</li></ul>',1);function P(d){var i=I(),c=s(f(i),32),g=a(c);e(g,()=>`<code class="language-python"><span class="token keyword">import</span> sys
<span class="token keyword">import</span> requests
<span class="token keyword">import</span> json
<span class="token keyword">import</span> os
<span class="token keyword">from</span> datetime <span class="token keyword">import</span> datetime<span class="token punctuation">,</span> timedelta

<span class="token keyword">def</span> <span class="token function">extract_props</span><span class="token punctuation">(</span>created_at<span class="token punctuation">:</span> <span class="token builtin">str</span><span class="token punctuation">,</span> directory<span class="token punctuation">:</span> <span class="token builtin">str</span> <span class="token operator">=</span> <span class="token string">"."</span><span class="token punctuation">)</span> <span class="token operator">-</span><span class="token operator">></span> <span class="token builtin">bool</span><span class="token punctuation">:</span>
    <span class="token triple-quoted-string string">'''Extract property data from the API of ACME for a specific date. The data will be saved in
    &#96;&lt;directory>/bronze/&#96; with the name &#96;props_&#123;created_at&#125;.json&#96;.
    '''</span>
    <span class="token comment"># Make a GET request to the API endpoint</span>
    <span class="token keyword">try</span><span class="token punctuation">:</span>
        <span class="token comment"># Extract property data from the API of ACME</span>
        response <span class="token operator">=</span> requests<span class="token punctuation">.</span>get<span class="token punctuation">(</span><span class="token string-interpolation"><span class="token string">f"http://localhost:12345/api/properties/</span><span class="token interpolation"><span class="token punctuation">&#123;</span>created_at<span class="token punctuation">&#125;</span></span><span class="token string">"</span></span><span class="token punctuation">,</span> timeout<span class="token operator">=</span><span class="token number">10</span><span class="token punctuation">)</span>
    <span class="token keyword">except</span> requests<span class="token punctuation">.</span>RequestException<span class="token punctuation">:</span>
        <span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string">"Error: Cannot connect to the API. Please check if the API is running and the URL is correct."</span><span class="token punctuation">)</span>
        <span class="token keyword">return</span> <span class="token boolean">False</span>

    <span class="token comment"># Check if the request was successful</span>
    <span class="token keyword">if</span> response<span class="token punctuation">.</span>status_code <span class="token operator">==</span> <span class="token number">200</span><span class="token punctuation">:</span>
        <span class="token comment"># Parse the JSON response</span>
        data <span class="token operator">=</span> response<span class="token punctuation">.</span>json<span class="token punctuation">(</span><span class="token punctuation">)</span>
        <span class="token comment"># Save the data to a json file</span>
        <span class="token keyword">with</span> <span class="token builtin">open</span><span class="token punctuation">(</span>os<span class="token punctuation">.</span>path<span class="token punctuation">.</span>join<span class="token punctuation">(</span>directory<span class="token punctuation">,</span> <span class="token string">'bronze'</span><span class="token punctuation">,</span> <span class="token string-interpolation"><span class="token string">f"props_</span><span class="token interpolation"><span class="token punctuation">&#123;</span>created_at<span class="token punctuation">&#125;</span></span><span class="token string">.json"</span></span><span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token string">"w"</span><span class="token punctuation">)</span> <span class="token keyword">as</span> f<span class="token punctuation">:</span>
            json<span class="token punctuation">.</span>dump<span class="token punctuation">(</span>data<span class="token punctuation">,</span> f<span class="token punctuation">,</span> indent<span class="token operator">=</span><span class="token number">2</span><span class="token punctuation">)</span>
    <span class="token keyword">else</span><span class="token punctuation">:</span>
        <span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string-interpolation"><span class="token string">f"Error: Failed to fetch data from API. Status code: </span><span class="token interpolation"><span class="token punctuation">&#123;</span>response<span class="token punctuation">.</span>status_code<span class="token punctuation">&#125;</span></span><span class="token string">"</span></span><span class="token punctuation">)</span>
        <span class="token keyword">return</span> <span class="token boolean">False</span>

    <span class="token keyword">return</span> <span class="token boolean">True</span>


<span class="token keyword">def</span> <span class="token function">main</span><span class="token punctuation">(</span>start_date<span class="token punctuation">:</span> <span class="token builtin">str</span><span class="token punctuation">,</span> directory<span class="token punctuation">:</span> <span class="token builtin">str</span> <span class="token operator">=</span> <span class="token string">"."</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
    extract_props<span class="token punctuation">(</span>start_date<span class="token punctuation">,</span> directory<span class="token punctuation">)</span>
    

<span class="token keyword">if</span> __name__ <span class="token operator">==</span> <span class="token string">"__main__"</span><span class="token punctuation">:</span>
    main<span class="token punctuation">(</span><span class="token operator">*</span>sys<span class="token punctuation">.</span>argv<span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">:</span><span class="token punctuation">]</span><span class="token punctuation">)</span></code>`),n(c);var l=s(c,8),_=a(l);e(_,()=>`<code class="language-python"><span class="token keyword">import</span> polars <span class="token keyword">as</span> pl
<span class="token keyword">import</span> sys
<span class="token keyword">from</span> pathlib <span class="token keyword">import</span> Path

<span class="token keyword">def</span> <span class="token function">transform_props</span><span class="token punctuation">(</span>created_at<span class="token punctuation">:</span> <span class="token builtin">str</span><span class="token punctuation">,</span> main_directory<span class="token punctuation">:</span> <span class="token builtin">str</span> <span class="token operator">=</span> <span class="token string">"."</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
    bronze_dir <span class="token operator">=</span> Path<span class="token punctuation">(</span>main_directory<span class="token punctuation">)</span> <span class="token operator">/</span> <span class="token string">"bronze"</span>
    silver_dir <span class="token operator">=</span> Path<span class="token punctuation">(</span>main_directory<span class="token punctuation">)</span> <span class="token operator">/</span> <span class="token string">"silver"</span> <span class="token operator">/</span> <span class="token string-interpolation"><span class="token string">f'date=</span><span class="token interpolation"><span class="token punctuation">&#123;</span>created_at<span class="token punctuation">&#125;</span></span><span class="token string">'</span></span>

    <span class="token comment"># add Hive style partitioning to the output path</span>
    input_path <span class="token operator">=</span> bronze_dir <span class="token operator">/</span> <span class="token string-interpolation"><span class="token string">f"props_</span><span class="token interpolation"><span class="token punctuation">&#123;</span>created_at<span class="token punctuation">&#125;</span></span><span class="token string">.json"</span></span>
    silver_dir<span class="token punctuation">.</span>mkdir<span class="token punctuation">(</span>parents<span class="token operator">=</span><span class="token boolean">True</span><span class="token punctuation">,</span> exist_ok<span class="token operator">=</span><span class="token boolean">True</span><span class="token punctuation">)</span>
    output_path <span class="token operator">=</span> silver_dir <span class="token operator">/</span> <span class="token string-interpolation"><span class="token string">f"props_</span><span class="token interpolation"><span class="token punctuation">&#123;</span>created_at<span class="token punctuation">&#125;</span></span><span class="token string">.parquet"</span></span>

    df <span class="token operator">=</span> pl<span class="token punctuation">.</span>read_json<span class="token punctuation">(</span>
        input_path<span class="token punctuation">,</span>
        schema<span class="token operator">=</span><span class="token punctuation">&#123;</span>
            <span class="token string">"id"</span><span class="token punctuation">:</span> pl<span class="token punctuation">.</span>String<span class="token punctuation">,</span>
            <span class="token string">"title"</span><span class="token punctuation">:</span> pl<span class="token punctuation">.</span>String<span class="token punctuation">,</span>
            <span class="token string">"description"</span><span class="token punctuation">:</span> pl<span class="token punctuation">.</span>String<span class="token punctuation">,</span>
            <span class="token string">"property_type"</span><span class="token punctuation">:</span> pl<span class="token punctuation">.</span>String<span class="token punctuation">,</span>
            <span class="token string">"cold_rent"</span><span class="token punctuation">:</span> pl<span class="token punctuation">.</span>Int64<span class="token punctuation">,</span>
            <span class="token string">"warm_rent"</span><span class="token punctuation">:</span> pl<span class="token punctuation">.</span>Int64<span class="token punctuation">,</span>
            <span class="token string">"deposit"</span><span class="token punctuation">:</span> pl<span class="token punctuation">.</span>Int64<span class="token punctuation">,</span>
            <span class="token string">"area_m2"</span><span class="token punctuation">:</span> pl<span class="token punctuation">.</span>Float64<span class="token punctuation">,</span>
            <span class="token string">"rooms"</span><span class="token punctuation">:</span> pl<span class="token punctuation">.</span>Int64<span class="token punctuation">,</span>
            <span class="token string">"bathrooms"</span><span class="token punctuation">:</span> pl<span class="token punctuation">.</span>Int64<span class="token punctuation">,</span>
            <span class="token string">"location"</span><span class="token punctuation">:</span> pl<span class="token punctuation">.</span>Struct<span class="token punctuation">(</span><span class="token punctuation">[</span>pl<span class="token punctuation">.</span>Field<span class="token punctuation">(</span><span class="token string">"lat"</span><span class="token punctuation">,</span> pl<span class="token punctuation">.</span>Float64<span class="token punctuation">)</span><span class="token punctuation">,</span> pl<span class="token punctuation">.</span>Field<span class="token punctuation">(</span><span class="token string">"lng"</span><span class="token punctuation">,</span> pl<span class="token punctuation">.</span>Float64<span class="token punctuation">)</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
            <span class="token string">"address"</span><span class="token punctuation">:</span> pl<span class="token punctuation">.</span>String<span class="token punctuation">,</span>
            <span class="token string">"neighborhood"</span><span class="token punctuation">:</span> pl<span class="token punctuation">.</span>String<span class="token punctuation">,</span>
            <span class="token string">"zip_code"</span><span class="token punctuation">:</span> pl<span class="token punctuation">.</span>String<span class="token punctuation">,</span>
            <span class="token string">"floor"</span><span class="token punctuation">:</span> pl<span class="token punctuation">.</span>Int64<span class="token punctuation">,</span>
            <span class="token string">"total_floors"</span><span class="token punctuation">:</span> pl<span class="token punctuation">.</span>Int64<span class="token punctuation">,</span>
            <span class="token string">"year_built"</span><span class="token punctuation">:</span> pl<span class="token punctuation">.</span>Int64<span class="token punctuation">,</span>
            <span class="token string">"furnishing"</span><span class="token punctuation">:</span> pl<span class="token punctuation">.</span>String<span class="token punctuation">,</span>
            <span class="token string">"has_gas"</span><span class="token punctuation">:</span> pl<span class="token punctuation">.</span>Boolean<span class="token punctuation">,</span>
            <span class="token string">"heating_type"</span><span class="token punctuation">:</span> pl<span class="token punctuation">.</span>String<span class="token punctuation">,</span>
            <span class="token string">"has_elevator"</span><span class="token punctuation">:</span> pl<span class="token punctuation">.</span>Boolean<span class="token punctuation">,</span>
            <span class="token string">"has_parking"</span><span class="token punctuation">:</span> pl<span class="token punctuation">.</span>Boolean<span class="token punctuation">,</span>
            <span class="token string">"has_balcony"</span><span class="token punctuation">:</span> pl<span class="token punctuation">.</span>Boolean<span class="token punctuation">,</span>
            <span class="token string">"pets_allowed"</span><span class="token punctuation">:</span> pl<span class="token punctuation">.</span>Boolean<span class="token punctuation">,</span>
            <span class="token string">"available_from"</span><span class="token punctuation">:</span> pl<span class="token punctuation">.</span>String<span class="token punctuation">,</span>
            <span class="token string">"nearest_u_s_distance"</span><span class="token punctuation">:</span> pl<span class="token punctuation">.</span>Int64<span class="token punctuation">,</span>
            <span class="token string">"nearest_bus_tram_distance"</span><span class="token punctuation">:</span> pl<span class="token punctuation">.</span>Int64<span class="token punctuation">,</span>
            <span class="token string">"nearest_school_distance"</span><span class="token punctuation">:</span> pl<span class="token punctuation">.</span>Int64<span class="token punctuation">,</span>
            <span class="token string">"nearest_hospital_distance"</span><span class="token punctuation">:</span> pl<span class="token punctuation">.</span>Int64<span class="token punctuation">,</span>
            <span class="token string">"nearest_supermarket_distance"</span><span class="token punctuation">:</span> pl<span class="token punctuation">.</span>Int64<span class="token punctuation">,</span>
            <span class="token string">"air_quality_index"</span><span class="token punctuation">:</span> pl<span class="token punctuation">.</span>Int64<span class="token punctuation">,</span>
            <span class="token string">"noise_level"</span><span class="token punctuation">:</span> pl<span class="token punctuation">.</span>Float64<span class="token punctuation">,</span>
            <span class="token string">"energy_efficiency"</span><span class="token punctuation">:</span> pl<span class="token punctuation">.</span>String<span class="token punctuation">,</span>
            <span class="token string">"created_at"</span><span class="token punctuation">:</span> pl<span class="token punctuation">.</span>String<span class="token punctuation">,</span>
        <span class="token punctuation">&#125;</span>
    <span class="token punctuation">)</span>

    initial_len <span class="token operator">=</span> df<span class="token punctuation">.</span>height
    df <span class="token operator">=</span> df<span class="token punctuation">.</span>unique<span class="token punctuation">(</span>subset<span class="token operator">=</span><span class="token punctuation">[</span><span class="token string">"id"</span><span class="token punctuation">]</span><span class="token punctuation">,</span> keep<span class="token operator">=</span><span class="token string">"first"</span><span class="token punctuation">)</span>
    dropped <span class="token operator">=</span> initial_len <span class="token operator">-</span> df<span class="token punctuation">.</span>height
    <span class="token keyword">if</span> dropped<span class="token punctuation">:</span>
        <span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string-interpolation"><span class="token string">f"Dropped </span><span class="token interpolation"><span class="token punctuation">&#123;</span>dropped<span class="token punctuation">&#125;</span></span><span class="token string"> duplicates."</span></span><span class="token punctuation">)</span>

    <span class="token comment"># Drop columns (ignore missing to avoid error)</span>
    df <span class="token operator">=</span> df<span class="token punctuation">.</span>drop<span class="token punctuation">(</span><span class="token punctuation">[</span><span class="token string">"id"</span><span class="token punctuation">,</span> <span class="token string">"title"</span><span class="token punctuation">,</span> <span class="token string">"description"</span><span class="token punctuation">,</span> <span class="token string">"address"</span><span class="token punctuation">]</span><span class="token punctuation">,</span> strict<span class="token operator">=</span><span class="token boolean">False</span><span class="token punctuation">)</span>

    df<span class="token punctuation">.</span>write_parquet<span class="token punctuation">(</span>output_path<span class="token punctuation">)</span>


<span class="token keyword">def</span> <span class="token function">main</span><span class="token punctuation">(</span>created_at<span class="token punctuation">:</span> <span class="token builtin">str</span><span class="token punctuation">,</span> main_directory<span class="token punctuation">:</span> <span class="token builtin">str</span> <span class="token operator">=</span> <span class="token string">"."</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
    silver_dir <span class="token operator">=</span> Path<span class="token punctuation">(</span>main_directory<span class="token punctuation">)</span> <span class="token operator">/</span> <span class="token string">"silver"</span>
    silver_dir<span class="token punctuation">.</span>mkdir<span class="token punctuation">(</span>parents<span class="token operator">=</span><span class="token boolean">True</span><span class="token punctuation">,</span> exist_ok<span class="token operator">=</span><span class="token boolean">True</span><span class="token punctuation">)</span>
    transform_props<span class="token punctuation">(</span>created_at<span class="token operator">=</span>created_at<span class="token punctuation">,</span> main_directory<span class="token operator">=</span>main_directory<span class="token punctuation">)</span>

<span class="token keyword">if</span> __name__ <span class="token operator">==</span> <span class="token string">"__main__"</span><span class="token punctuation">:</span>
    main<span class="token punctuation">(</span><span class="token operator">*</span>sys<span class="token punctuation">.</span>argv<span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">:</span><span class="token punctuation">]</span><span class="token punctuation">)</span></code>`),n(l);var t=s(l,8),u=a(t);e(u,()=>`<code class="language-python"><span class="token keyword">import</span> subprocess
<span class="token keyword">import</span> sys

<span class="token keyword">def</span> <span class="token function">dbt_transform</span><span class="token punctuation">(</span>path<span class="token punctuation">:</span> <span class="token builtin">str</span> <span class="token operator">=</span> <span class="token string">'./rental_dbt'</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
    <span class="token triple-quoted-string string">"""
    Runs dbt run to transform Silver -> Gold tables.
    """</span>
    <span class="token keyword">try</span><span class="token punctuation">:</span>
        <span class="token comment"># Run dbt in the project directory</span>
        result <span class="token operator">=</span> subprocess<span class="token punctuation">.</span>run<span class="token punctuation">(</span>
            <span class="token punctuation">[</span><span class="token string">"dbt"</span><span class="token punctuation">,</span> <span class="token string">"run"</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
            check<span class="token operator">=</span><span class="token boolean">True</span><span class="token punctuation">,</span>
            capture_output<span class="token operator">=</span><span class="token boolean">True</span><span class="token punctuation">,</span>
            text<span class="token operator">=</span><span class="token boolean">True</span><span class="token punctuation">,</span>
            cwd<span class="token operator">=</span>path
        <span class="token punctuation">)</span>
        <span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string">"dbt run completed successfully."</span><span class="token punctuation">)</span>
        <span class="token keyword">print</span><span class="token punctuation">(</span>result<span class="token punctuation">.</span>stdout<span class="token punctuation">)</span>
    <span class="token keyword">except</span> subprocess<span class="token punctuation">.</span>CalledProcessError <span class="token keyword">as</span> e<span class="token punctuation">:</span>
        <span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string-interpolation"><span class="token string">f"dbt run failed: </span><span class="token interpolation"><span class="token punctuation">&#123;</span>e<span class="token punctuation">.</span>stderr<span class="token punctuation">&#125;</span></span><span class="token string">"</span></span><span class="token punctuation">)</span>
        <span class="token keyword">raise</span> e
    
<span class="token keyword">if</span> __name__ <span class="token operator">==</span> <span class="token string">"__main__"</span><span class="token punctuation">:</span>
    dbt_transform<span class="token punctuation">(</span><span class="token operator">*</span>sys<span class="token punctuation">.</span>argv<span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">:</span><span class="token punctuation">]</span><span class="token punctuation">)</span></code>`),n(t);var p=s(t,4),m=a(p);e(m,()=>`<code class="language-sql"><span class="token keyword">WITH</span> neighborhood_stats <span class="token keyword">AS</span> <span class="token punctuation">(</span>
    <span class="token keyword">SELECT</span> 
        neighborhood<span class="token punctuation">,</span>
        <span class="token function">COUNT</span><span class="token punctuation">(</span><span class="token operator">*</span><span class="token punctuation">)</span> <span class="token keyword">as</span> num_properties<span class="token punctuation">,</span>
        <span class="token function">AVG</span><span class="token punctuation">(</span>warm_rent<span class="token punctuation">)</span> <span class="token keyword">as</span> avg_warm_rent<span class="token punctuation">,</span>
        MEDIAN<span class="token punctuation">(</span>warm_rent<span class="token punctuation">)</span> <span class="token keyword">as</span> median_warm_rent<span class="token punctuation">,</span>
        <span class="token function">MIN</span><span class="token punctuation">(</span>warm_rent<span class="token punctuation">)</span> <span class="token keyword">as</span> min_warm_rent<span class="token punctuation">,</span>
        <span class="token function">MAX</span><span class="token punctuation">(</span>warm_rent<span class="token punctuation">)</span> <span class="token keyword">as</span> max_warm_rent
    <span class="token keyword">FROM</span> &#123;&#123; source<span class="token punctuation">(</span><span class="token string">'rental_data'</span><span class="token punctuation">,</span> <span class="token string">'properties'</span><span class="token punctuation">)</span> &#125;&#125;
    <span class="token keyword">WHERE</span> warm_rent <span class="token operator">IS</span> <span class="token operator">NOT</span> <span class="token boolean">NULL</span> 
        <span class="token operator">AND</span> warm_rent <span class="token operator">></span> <span class="token number">0</span>
        <span class="token operator">AND</span> neighborhood <span class="token operator">IS</span> <span class="token operator">NOT</span> <span class="token boolean">NULL</span>
        <span class="token operator">AND</span> neighborhood <span class="token operator">!=</span> <span class="token string">''</span>
    <span class="token keyword">GROUP</span> <span class="token keyword">BY</span> neighborhood
    <span class="token keyword">HAVING</span> <span class="token function">COUNT</span><span class="token punctuation">(</span><span class="token operator">*</span><span class="token punctuation">)</span> <span class="token operator">>=</span> <span class="token number">5</span>  <span class="token comment">-- Only neighborhoods with at least 5 properties</span>
<span class="token punctuation">)</span>
<span class="token keyword">SELECT</span> 
    neighborhood<span class="token punctuation">,</span>
    num_properties<span class="token punctuation">,</span>
    <span class="token function">ROUND</span><span class="token punctuation">(</span>avg_warm_rent<span class="token punctuation">,</span> <span class="token number">2</span><span class="token punctuation">)</span> <span class="token keyword">as</span> avg_warm_rent<span class="token punctuation">,</span>
    median_warm_rent<span class="token punctuation">,</span>
    RANK<span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token keyword">OVER</span> <span class="token punctuation">(</span><span class="token keyword">ORDER</span> <span class="token keyword">BY</span> avg_warm_rent <span class="token keyword">DESC</span><span class="token punctuation">)</span> <span class="token keyword">as</span> rank_highest<span class="token punctuation">,</span>
    RANK<span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token keyword">OVER</span> <span class="token punctuation">(</span><span class="token keyword">ORDER</span> <span class="token keyword">BY</span> avg_warm_rent <span class="token keyword">ASC</span><span class="token punctuation">)</span> <span class="token keyword">as</span> rank_lowest
<span class="token keyword">FROM</span> neighborhood_stats
<span class="token keyword">ORDER</span> <span class="token keyword">BY</span> avg_warm_rent <span class="token keyword">DESC</span></code>`),n(p);var o=s(p,10),r=a(o);e(r,()=>`<code class="language-python"><span class="token keyword">from</span> prefect <span class="token keyword">import</span> flow<span class="token punctuation">,</span> task
<span class="token keyword">from</span> datetime <span class="token keyword">import</span> datetime<span class="token punctuation">,</span> timedelta
<span class="token keyword">from</span> elt_tobronze <span class="token keyword">import</span> extract_props
<span class="token keyword">from</span> elt_tosilver <span class="token keyword">import</span> transform_props
<span class="token keyword">from</span> elt_togold <span class="token keyword">import</span> dbt_transform

<span class="token decorator annotation punctuation">@task</span>
<span class="token keyword">def</span> <span class="token function">elt_bronze</span><span class="token punctuation">(</span>date<span class="token punctuation">:</span> <span class="token builtin">str</span><span class="token punctuation">,</span> main_dir<span class="token punctuation">:</span> <span class="token builtin">str</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
    <span class="token keyword">return</span> extract_props<span class="token punctuation">(</span>date<span class="token punctuation">,</span> main_dir<span class="token punctuation">)</span>

<span class="token decorator annotation punctuation">@task</span>
<span class="token keyword">def</span> <span class="token function">elt_silver</span><span class="token punctuation">(</span>date<span class="token punctuation">:</span> <span class="token builtin">str</span><span class="token punctuation">,</span> main_dir<span class="token punctuation">:</span> <span class="token builtin">str</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
    transform_props<span class="token punctuation">(</span>date<span class="token punctuation">,</span> main_dir<span class="token punctuation">)</span>

<span class="token decorator annotation punctuation">@task</span>
<span class="token keyword">def</span> <span class="token function">elt_gold</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
    dbt_transform<span class="token punctuation">(</span><span class="token punctuation">)</span>

<span class="token decorator annotation punctuation">@flow</span>
<span class="token keyword">def</span> <span class="token function">rental_pipeline</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
    date <span class="token operator">=</span> <span class="token punctuation">(</span>datetime<span class="token punctuation">.</span>now<span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">-</span> timedelta<span class="token punctuation">(</span>days<span class="token operator">=</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">.</span>date<span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span>isoformat<span class="token punctuation">(</span><span class="token punctuation">)</span>
    <span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string-interpolation"><span class="token string">f"🚀 Running rental pipeline for date: </span><span class="token interpolation"><span class="token punctuation">&#123;</span>date<span class="token punctuation">&#125;</span></span><span class="token string">"</span></span><span class="token punctuation">)</span>
    
    <span class="token comment"># If transform MUST run after extract completes:</span>
    extract_result <span class="token operator">=</span> elt_bronze<span class="token punctuation">(</span>date<span class="token punctuation">,</span> <span class="token string">'rental_data'</span><span class="token punctuation">)</span>
    <span class="token keyword">if</span> <span class="token keyword">not</span> extract_result<span class="token punctuation">:</span>
        <span class="token keyword">raise</span> Exception<span class="token punctuation">(</span><span class="token string">'Error: Data extraction was unsuccessful.'</span><span class="token punctuation">)</span>
    <span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string-interpolation"><span class="token string">f"✅ Extraction completed!"</span></span><span class="token punctuation">)</span>
    elt_silver<span class="token punctuation">(</span>date<span class="token punctuation">,</span> <span class="token string">'rental_data'</span><span class="token punctuation">)</span>
    <span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string-interpolation"><span class="token string">f"✅ Transformation completed!"</span></span><span class="token punctuation">)</span>
    elt_gold<span class="token punctuation">(</span><span class="token punctuation">)</span>
    <span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string-interpolation"><span class="token string">f"✅ Database updated!"</span></span><span class="token punctuation">)</span>

<span class="token comment"># if __name__ == "__main__":</span>
<span class="token comment">#     rental_pipeline.serve(</span>
<span class="token comment">#         name='rental-pipeline',</span>
<span class="token comment">#         cron='* * * * *',</span>
<span class="token comment">#     )</span>

<span class="token keyword">if</span> __name__ <span class="token operator">==</span> <span class="token string">"__main__"</span><span class="token punctuation">:</span>
    rental_pipeline<span class="token punctuation">.</span>deploy<span class="token punctuation">(</span>
        name<span class="token operator">=</span><span class="token string">"my-deployment"</span><span class="token punctuation">,</span>
        work_pool_name<span class="token operator">=</span><span class="token string">"my-work-pool"</span><span class="token punctuation">,</span>
        image<span class="token operator">=</span><span class="token string">"localhost/rental-pipeline:latest"</span><span class="token punctuation">,</span>
        build<span class="token operator">=</span><span class="token boolean">False</span><span class="token punctuation">,</span>  <span class="token comment"># Skip building, use existing image</span>
        push<span class="token operator">=</span><span class="token boolean">False</span><span class="token punctuation">,</span>
    <span class="token punctuation">)</span></code>`),n(o);var k=s(o,4),h=a(k);e(h,()=>`<code class="language-python"><span class="token keyword">import</span> streamlit <span class="token keyword">as</span> st
<span class="token keyword">import</span> duckdb
<span class="token keyword">import</span> pandas <span class="token keyword">as</span> pd
<span class="token keyword">import</span> plotly<span class="token punctuation">.</span>express <span class="token keyword">as</span> px

<span class="token decorator annotation punctuation">@st<span class="token punctuation">.</span>cache_data</span>
<span class="token keyword">def</span> <span class="token function">load_data</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
    conn <span class="token operator">=</span> duckdb<span class="token punctuation">.</span>connect<span class="token punctuation">(</span><span class="token string">'rental_data/gold/dev.duckdb'</span><span class="token punctuation">)</span>
    data <span class="token operator">=</span> <span class="token punctuation">&#123;</span>
        <span class="token string">'trend'</span><span class="token punctuation">:</span> conn<span class="token punctuation">.</span>execute<span class="token punctuation">(</span><span class="token string">"SELECT * FROM rent_trend"</span><span class="token punctuation">)</span><span class="token punctuation">.</span>df<span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
        <span class="token string">'rankings'</span><span class="token punctuation">:</span> conn<span class="token punctuation">.</span>execute<span class="token punctuation">(</span><span class="token string">"SELECT * FROM nb_rent_ranking"</span><span class="token punctuation">)</span><span class="token punctuation">.</span>df<span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
        <span class="token string">'listings'</span><span class="token punctuation">:</span> conn<span class="token punctuation">.</span>execute<span class="token punctuation">(</span><span class="token string">"SELECT * FROM nb_listings"</span><span class="token punctuation">)</span><span class="token punctuation">.</span>df<span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
        <span class="token string">'furnished'</span><span class="token punctuation">:</span> conn<span class="token punctuation">.</span>execute<span class="token punctuation">(</span><span class="token string">"SELECT * FROM furnished_impact"</span><span class="token punctuation">)</span><span class="token punctuation">.</span>df<span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
        <span class="token string">'pct'</span><span class="token punctuation">:</span> conn<span class="token punctuation">.</span>execute<span class="token punctuation">(</span><span class="token string">"SELECT * FROM furnished_percentage"</span><span class="token punctuation">)</span><span class="token punctuation">.</span>df<span class="token punctuation">(</span><span class="token punctuation">)</span>
    <span class="token punctuation">&#125;</span>
    conn<span class="token punctuation">.</span>close<span class="token punctuation">(</span><span class="token punctuation">)</span>
    <span class="token keyword">return</span> data

<span class="token keyword">def</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
    st<span class="token punctuation">.</span>set_page_config<span class="token punctuation">(</span>layout<span class="token operator">=</span><span class="token string">"wide"</span><span class="token punctuation">)</span>
    st<span class="token punctuation">.</span>title<span class="token punctuation">(</span><span class="token string">"Rental Market Analysis"</span><span class="token punctuation">)</span>

    data <span class="token operator">=</span> load_data<span class="token punctuation">(</span><span class="token punctuation">)</span>

    <span class="token comment"># Layout</span>
    col1<span class="token punctuation">,</span> col2 <span class="token operator">=</span> st<span class="token punctuation">.</span>columns<span class="token punctuation">(</span><span class="token number">2</span><span class="token punctuation">)</span>

    <span class="token keyword">with</span> col1<span class="token punctuation">:</span>
        st<span class="token punctuation">.</span>subheader<span class="token punctuation">(</span><span class="token string">"Rent Trend"</span><span class="token punctuation">)</span>
        fig <span class="token operator">=</span> px<span class="token punctuation">.</span>line<span class="token punctuation">(</span>data<span class="token punctuation">[</span><span class="token string">'trend'</span><span class="token punctuation">]</span><span class="token punctuation">,</span> x<span class="token operator">=</span><span class="token string">'quarter'</span><span class="token punctuation">,</span> y<span class="token operator">=</span><span class="token string">'avg_warm_rent'</span><span class="token punctuation">)</span>
        st<span class="token punctuation">.</span>plotly_chart<span class="token punctuation">(</span>fig<span class="token punctuation">,</span> width<span class="token operator">=</span><span class="token string">'stretch'</span><span class="token punctuation">)</span>

    <span class="token keyword">with</span> col2<span class="token punctuation">:</span>
        st<span class="token punctuation">.</span>subheader<span class="token punctuation">(</span><span class="token string">"Properties per Neighborhood"</span><span class="token punctuation">)</span>
        fig <span class="token operator">=</span> px<span class="token punctuation">.</span>bar<span class="token punctuation">(</span>data<span class="token punctuation">[</span><span class="token string">'listings'</span><span class="token punctuation">]</span><span class="token punctuation">.</span>head<span class="token punctuation">(</span><span class="token number">10</span><span class="token punctuation">)</span><span class="token punctuation">,</span> x<span class="token operator">=</span><span class="token string">'neighborhood'</span><span class="token punctuation">,</span> y<span class="token operator">=</span><span class="token string">'total_properties'</span><span class="token punctuation">)</span>
        st<span class="token punctuation">.</span>plotly_chart<span class="token punctuation">(</span>fig<span class="token punctuation">,</span> width<span class="token operator">=</span><span class="token string">'stretch'</span><span class="token punctuation">)</span>
        
    col1<span class="token punctuation">,</span> col2<span class="token punctuation">,</span> col3 <span class="token operator">=</span> st<span class="token punctuation">.</span>columns<span class="token punctuation">(</span><span class="token number">3</span><span class="token punctuation">)</span>

    <span class="token keyword">with</span> col1<span class="token punctuation">:</span>
        st<span class="token punctuation">.</span>subheader<span class="token punctuation">(</span><span class="token string">"Top Neighborhoods by Rent"</span><span class="token punctuation">)</span>
        fig <span class="token operator">=</span> px<span class="token punctuation">.</span>bar<span class="token punctuation">(</span>data<span class="token punctuation">[</span><span class="token string">'rankings'</span><span class="token punctuation">]</span><span class="token punctuation">.</span>head<span class="token punctuation">(</span><span class="token number">10</span><span class="token punctuation">)</span><span class="token punctuation">,</span> x<span class="token operator">=</span><span class="token string">'neighborhood'</span><span class="token punctuation">,</span> y<span class="token operator">=</span><span class="token string">'avg_warm_rent'</span><span class="token punctuation">)</span>
        st<span class="token punctuation">.</span>plotly_chart<span class="token punctuation">(</span>fig<span class="token punctuation">,</span> width<span class="token operator">=</span><span class="token string">'stretch'</span><span class="token punctuation">)</span>

    <span class="token keyword">with</span> col2<span class="token punctuation">:</span>
        st<span class="token punctuation">.</span>subheader<span class="token punctuation">(</span><span class="token string">"Furnished Premium"</span><span class="token punctuation">)</span>
        fig <span class="token operator">=</span> px<span class="token punctuation">.</span>bar<span class="token punctuation">(</span>data<span class="token punctuation">[</span><span class="token string">'furnished'</span><span class="token punctuation">]</span><span class="token punctuation">,</span> x<span class="token operator">=</span><span class="token string">'furnishing_category'</span><span class="token punctuation">,</span> y<span class="token operator">=</span><span class="token string">'avg_warm_rent'</span><span class="token punctuation">)</span>
        st<span class="token punctuation">.</span>plotly_chart<span class="token punctuation">(</span>fig<span class="token punctuation">,</span> width<span class="token operator">=</span><span class="token string">'stretch'</span><span class="token punctuation">)</span>

    <span class="token keyword">with</span> col3<span class="token punctuation">:</span>
        st<span class="token punctuation">.</span>subheader<span class="token punctuation">(</span><span class="token string">"Market Composition"</span><span class="token punctuation">)</span>
        fig <span class="token operator">=</span> px<span class="token punctuation">.</span>pie<span class="token punctuation">(</span>data<span class="token punctuation">[</span><span class="token string">'pct'</span><span class="token punctuation">]</span><span class="token punctuation">,</span> values<span class="token operator">=</span><span class="token string">'percentage'</span><span class="token punctuation">,</span> names<span class="token operator">=</span><span class="token string">'percentage'</span><span class="token punctuation">)</span>
        st<span class="token punctuation">.</span>plotly_chart<span class="token punctuation">(</span>fig<span class="token punctuation">,</span> width<span class="token operator">=</span><span class="token string">'stretch'</span><span class="token punctuation">)</span>

<span class="token keyword">if</span> __name__ <span class="token operator">==</span> <span class="token string">"__main__"</span><span class="token punctuation">:</span>
    main<span class="token punctuation">(</span><span class="token punctuation">)</span></code>`),n(k),b(4),w(d,i)}var R=y('<section><div class="portfolio my-8"><!> <!></div> <div class="mt-8 mb-20"><div class="portfolio"><h2>See also</h2></div> <p>See some other relevant projects:</p> <div class="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 my-8"></div></div></section>');function N(d){let i="Berlin Rental Analytics",c=["Orchestration","Data Processing","Storage","Transformation","Visualization"],g=[["Prefect"],["Polars"],["DuckDB"],["dbt"],["Streamlit"]],l="https://github.com/christos-golsouzidis/Berlin_rental_analytics",_=[{text:"A data analysis on cryptocurrency",link:"cryptocurrency"},{text:"Anti-captcha application",link:"anticaptcha"},{text:"Infrang (INFormation Retrieval and ANswer Generation)",link:"infrang"}];var t=R(),u=a(t),p=a(u);E(p,{titleList:c,techList:g,githubLink:l,name:i});var m=s(p,2);P(m),n(u);var o=s(u,2),r=s(a(o),4);x(r,5,()=>_,S,(k,h)=>{T(k,{get items(){return v(h)}})}),n(r),n(o),n(t),w(d,t)}export{N as component};
